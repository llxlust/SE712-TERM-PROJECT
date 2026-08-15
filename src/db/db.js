const { readData } = require("./fs-helper");
const path = require("path");
class Database {
  from_value = "";
  store_value = [];
  constructor() {}

  async from(form_name) {
    try {
      this.from_value = form_name;
      const filePath = path.join(
        __dirname,
        "../db/stores",
        `${form_name}.json`,
      );
      const data = await readData(filePath);
      this.store_value = [...data.data];
      return this;
    } catch (error) {}
  }

  select(field) {
    if (!this.store_value) {
      return this;
    }
    if (field === "*") {
      return this;
    }
    const field_array = field.split(",");
    return this;
  }

  eq(field, filter_value) {
    if (this.store_value.length < 1) {
      return this;
    }

    const field_check = this.store_value[0][field];

    if (!field_check) {
      return this;
    }
    const temp = [...this.store_value];
    const filter_eq = temp.filter((value) => {
      return value[field] === filter_value;
    });
    this.store_value = [...filter_eq];
    return this;
  }

  end() {
    return this.store_value;
  }
}

module.exports = Database;
