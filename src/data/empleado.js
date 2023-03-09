import { faker } from "@faker-js/faker";
import { sample } from "lodash";

const users = [...Array(100)].map((_, index) => ({
  id: faker.datatype.uuid(),
  // avatarUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${index + 1}.png`,
  name: faker.name.firstName(),
  lastName: faker.name.lastName(),
  company: faker.company.companySuffix(),
  status: sample(["active", "inactive"]),
}));

export default users;
