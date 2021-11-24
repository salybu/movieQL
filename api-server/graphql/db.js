export const people = [
  {
    id: "0",
    name: "gn lee",
    age: 17,
    gender: "female",
  },
  {
    id: "1",
    name: "Jisu",
    age: 18,
    gender: "female",
  },
  {
    id: "2",
    name: "Yumi",
    age: 20,
    gender: "female",
  },
  {
    id: "3",
    name: "Tom",
    age: 15,
    gender: "male",
  },
  {
    id: "4",
    name: "Billy",
    age: 23,
    gender: "male",
  },
];

export const getById = (id) => {
  const filteredPeople = people.filter((person) => person.id === String(id));
  return filteredPeople[0];
};
