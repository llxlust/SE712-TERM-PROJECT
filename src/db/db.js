const { readData, writeData } = require("./fs-helper");
const path = require("path");

class Database {
  constructor() {
    this.reset();
  }

  reset() {
    this.from_value = "";
    this.file_path = "";
    this.store_value = [];

    this.operation = "SELECT";
    this.select_fields = ["*"];
    this.filters = [];
    this.payload = null;

    return this;
  }

  async from(from_name) {
    this.reset();

    this.from_value = from_name;

    this.file_path = path.join(__dirname, "../db/stores", `${from_name}.json`);

    const result = await readData(this.file_path);

    if (!result.ok) {
      throw result.error;
    }

    if (!Array.isArray(result.data)) {
      throw new Error(`${from_name}.json must contain an array`);
    }

    this.store_value = result.data;

    return this;
  }

  select(field = "*") {
    this.operation = "SELECT";

    if (field === "*") {
      this.select_fields = ["*"];
      return this;
    }

    this.select_fields = field
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    return this;
  }

  insert(payload) {
    this.operation = "INSERT";
    this.payload = payload;

    return this;
  }

  update(payload) {
    this.operation = "UPDATE";
    this.payload = payload;

    return this;
  }

  delete() {
    this.operation = "DELETE";

    return this;
  }

  eq(field, value) {
    this.filters.push({
      type: "eq",
      field,
      value,
    });

    return this;
  }

  neq(field, value) {
    this.filters.push({
      type: "neq",
      field,
      value,
    });

    return this;
  }

  gt(field, value) {
    this.filters.push({
      type: "gt",
      field,
      value,
    });

    return this;
  }

  gte(field, value) {
    this.filters.push({
      type: "gte",
      field,
      value,
    });

    return this;
  }

  lt(field, value) {
    this.filters.push({
      type: "lt",
      field,
      value,
    });

    return this;
  }

  lte(field, value) {
    this.filters.push({
      type: "lte",
      field,
      value,
    });

    return this;
  }

  applyFilters(data) {
    return data.filter((row) => {
      return this.filters.every((filter) => {
        const value = row[filter.field];

        switch (filter.type) {
          case "eq":
            return value === filter.value;

          case "neq":
            return value !== filter.value;

          case "gt":
            return value > filter.value;

          case "gte":
            return value >= filter.value;

          case "lt":
            return value < filter.value;

          case "lte":
            return value <= filter.value;

          default:
            return true;
        }
      });
    });
  }

  applySelect(data) {
    if (this.select_fields.includes("*")) {
      return data;
    }

    return data.map((row) => {
      const selected = {};

      for (const field of this.select_fields) {
        if (field in row) {
          selected[field] = row[field];
        }
      }

      return selected;
    });
  }

  async executeSelect() {
    let result = [...this.store_value];

    result = this.applyFilters(result);
    result = this.applySelect(result);

    return {
      data: result,
      ok: true,
      error: null,
    };
  }

  async executeInsert() {
    const payloads = Array.isArray(this.payload)
      ? this.payload
      : [this.payload];

    this.store_value.push(...payloads);

    const result = await writeData(this.file_path, this.store_value);

    if (!result.ok) {
      return result;
    }

    return {
      data: payloads,
      ok: true,
      error: null,
    };
  }

  async executeUpdate() {
    const updated = [];

    this.store_value = this.store_value.map((row) => {
      const matched = this.applyFilters([row]).length > 0;
      if (!matched) {
        return row;
      }

      const newRow = {
        ...row,
        ...this.payload,
      };

      updated.push(newRow);

      return newRow;
    });

    const result = await writeData(this.file_path, this.store_value);

    if (!result.ok) {
      return result;
    }

    return {
      data: updated,
      ok: true,
      error: null,
    };
  }

  async executeDelete() {
    const deleted = [];
    const remaining = [];

    for (const row of this.store_value) {
      const matched = this.applyFilters([row]).length > 0;

      if (matched) {
        deleted.push(row);
      } else {
        remaining.push(row);
      }
    }

    this.store_value = remaining;

    const result = await writeData(this.file_path, this.store_value);

    if (!result.ok) {
      return result;
    }

    return {
      data: deleted,
      ok: true,
      error: null,
    };
  }

  async end() {
    try {
      switch (this.operation) {
        case "SELECT":
          return await this.executeSelect();

        case "INSERT":
          return await this.executeInsert();

        case "UPDATE":
          return await this.executeUpdate();

        case "DELETE":
          return await this.executeDelete();

        default:
          throw new Error(`Unknown operation: ${this.operation}`);
      }
    } catch (error) {
      return {
        data: null,
        ok: false,
        error,
      };
    }
  }
}

module.exports = Database;
