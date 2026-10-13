export class EuroPresenter {
  present(amount: number): string {
    return this.formatterFor(amount).format(amount);
  }

  private formatterFor(amount: number): Intl.NumberFormat {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    });
  }
}
