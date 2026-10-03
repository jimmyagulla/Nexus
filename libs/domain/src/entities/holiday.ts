let holidaySequence = 0;

export class Holiday {
  private constructor(
    readonly id: string,
    readonly date: string,
    readonly label: string,
  ) {}

  static create(date: string, label: string): Holiday {
    holidaySequence += 1;
    return new Holiday(`holiday-${holidaySequence}`, date, label.trim());
  }

  static restore(id: string, date: string, label: string): Holiday {
    return new Holiday(id, date, label);
  }

  update(date: string, label: string): Holiday {
    return new Holiday(this.id, date, label.trim());
  }
}
