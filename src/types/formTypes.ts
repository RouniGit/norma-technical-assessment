interface BaseTaxRow {
  year: number;
  type: string;
}

export interface PermanentTaxesRow extends BaseTaxRow {
  monthlySalary: number;
}

export interface FreelancerTaxesRow extends BaseTaxRow {
  hourlyRate: number;
  hoursPerDay: number;
  daysPerYear: number;
}

export interface Taxes {
  rows: (PermanentTaxesRow | FreelancerTaxesRow)[];
}
