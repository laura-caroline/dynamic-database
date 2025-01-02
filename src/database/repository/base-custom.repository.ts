import { NotFoundException } from '@nestjs/common';
import {
  AbstractRepository,
  DataSource,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

import { DeepPartial } from 'typeorm/common/DeepPartial';
import { Brackets } from 'typeorm/query-builder/Brackets';
import { InjectDataSource } from '@nestjs/typeorm';

export abstract class BaseCustomRepository<
  Entity extends ObjectLiteral,
> extends Repository<Entity> {
  protected alias: string;
  private wheres = [];

  private _distinctData: string[] = [];
  private _orderByData: string[] = [];

  private _query: SelectQueryBuilder<Entity>;

  get hasDistinct(): boolean {
    return this._distinctData.length > 0;
  }

  get hasOrderBy(): boolean {
    return this._orderByData.length > 0;
  }

  abstract defaultSelect(): string[];

  init(alias: string) {
    this.alias = alias;
    this._query = super.createQueryBuilder(alias);
    this.wheres = [];
    this._orderByData = [`${alias}.created_at|DESC`];
    return this;
  }

  startWithoutOrdering(alias: string) {
    this.alias = alias;
    this._query = super.createQueryBuilder(alias);
    this.wheres = [];
    return this;
  }

  resetOrderBy() {
    this._orderByData = [];
    return this;
  }

  runAdicionalArgs() {
    if (this.hasDistinct) this.addDistinct();
    if (this.hasOrderBy) this.addOrderBy();

    this.compileWhere();
    return this;
  }

  getSql() {
    this.compileWhere();
    return {
      sql: this._query.getSql(),
      parameters: this._query.getParameters(),
    };
  }

  async getOne(): Promise<Entity> {
    this.compileWhere();
    return await this._query.getOneOrFail().catch(() => {
      throw new NotFoundException();
    });
  }

  async getMany(): Promise<Entity[]> {
    this.runAdicionalArgs();
    return await this._query.getMany();
  }

  leftJoin(leftJoin: string, alias: string, withSelect: boolean): this;
  leftJoin(leftJoin: string, alias: string): this;
  leftJoin(leftJoin: string, alias: string, withSelect?: false) {
    if (withSelect) {
      this._query.leftJoinAndSelect(leftJoin, alias);
      return this;
    }
    this._query.leftJoin(leftJoin, alias);
    return this;
  }

  select(data?: string[], mergeSelect = true): this {
    let select = this.defaultSelect();

    if (data && data.length > 0) {
      if (mergeSelect) select = [...select, ...data];
      else select = data;
    }

    this._query.select(select);
    return this;
  }

  where(
    where:
      | Brackets
      | string
      | ((qb: this) => string)
      | ObjectLiteral
      | ObjectLiteral[],
    parameters?: ObjectLiteral,
  ): this {
    this.wheres.push({ where, parameters });
    return this;
  }

  compileWhere(): this {
    this.wheres.forEach(({ where, parameters }, i) => {
      if (i === 0) {
        this._query.where(where, parameters);
        return;
      }

      this._query.andWhere(where, parameters);
    });
    return this;
  }

  async getByUuid(uuid: string, byQuery = false): Promise<Entity> | null {
    return this.findOneOrFail({
      where: {
        uuid: uuid, // Tipando explicitamente se necessário
      } as unknown as FindOptionsWhere<Entity>, // Garantir que o tipo corresponde à entidade
    }).catch(() => {
      return null; // Caso não encontre, retorna null
    });
  }

  formatData(entity: Entity): Entity {
    return entity;
  }

  orderBy(order, reset = false) {
    if (reset) this.resetOrderBy();
    this._orderByData.push(order);
    return this;
  }

  groupBy(group: string) {
    this._query.groupBy(group);
    return this;
  }

  distinct(column: string[] | true): this {
    if (Array.isArray(column)) {
      this._distinctData = column;
      return this;
    }

    this._distinctData = [];
    return this;
  }

  async checkDuplicate(
    field: string,
    value: string,
    uuid?: string,
  ): Promise<boolean> {
    return await this.createQueryBuilder(this.alias)
      .where(`${this.alias}.${field} = :value`, { value })
      .andWhere(`${this.alias}.uuid NOT IN(:uuid)`, { uuid })
      .getCount()
      .then((count) => count === 0);
  }

  private addDistinct(): this {
    if (Array.isArray(this._distinctData)) {
      this._query.distinctOn(this._distinctData);
      return this;
    }

    this._query.distinct(true);
    return this;
  }

  private addOrderBy(): this {
    if (this._orderByData.length) {
      const orderBy = {};
      this._orderByData.map((order) => {
        const [field, direction] = order.split('|');
        if (direction) {
          orderBy[field] = { order: direction, nulls: 'NULLS LAST' };
          return;
        }

        orderBy[field] = 'ASC';
      });
      this._query.orderBy(orderBy);
    }

    return this;
  }
}
