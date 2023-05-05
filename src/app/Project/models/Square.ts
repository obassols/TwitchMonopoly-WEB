export class Square {
  id: number;
  name: string;
  shortName: string;
  type: string;

  constructor(id: number, name: string, shortName: string, type: string) {
    this.id = id;
    this.name = name;
    this.shortName = shortName;
    this.type = type;
  }
}