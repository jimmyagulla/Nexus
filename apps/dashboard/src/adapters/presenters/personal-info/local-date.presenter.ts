export interface LocalDateModel {
  /** `jj/mm/aaaa` */
  day: string;
  /** `hh:mm` */
  time: string;
}

/** Presents an instant in the time zone of the device. */
export class LocalDatePresenter {
  present(instant: Date): LocalDateModel {
    const day = this.twoDigits(instant.getDate());
    const month = this.twoDigits(instant.getMonth() + 1);
    return {
      day: `${day}/${month}/${instant.getFullYear()}`,
      time: `${this.twoDigits(instant.getHours())}:${this.twoDigits(instant.getMinutes())}`,
    };
  }

  private twoDigits(value: number): string {
    return String(value).padStart(2, '0');
  }
}
