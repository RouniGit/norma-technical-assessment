import { sum } from "lodash"
import { FreelanceTaxRate, PermanentTaxRate } from "../constants/taxRates"
import { FreelancerTaxesRow, PermanentTaxesRow } from "../types/formTypes"

export function getAnnualizedMonthlySalary(amount: number): number {
	return amount * 12
}

export function getPermanentTaxesAnnualizedTotal(rows: PermanentTaxesRow[]): number {
	return sum(rows.map((row) => getAnnualizedMonthlySalary(row.monthlySalary)))
}

export function getPermanentTaxesAnnualizedTotalAfterTaxes(rows: PermanentTaxesRow[]): number {
	return sum(
		rows.map((row) => {
			const annualizedMonthlySalary = getAnnualizedMonthlySalary(row.monthlySalary)
			return annualizedMonthlySalary * (1 - PermanentTaxRate)
		})
	)
}

export function getFreelancerTaxesAnnualizedTotal(rows: FreelancerTaxesRow[]): number {
	return sum(rows.map(getFreelancerYearlyRevenue))
}

export function getFreelancerTaxesAnnualizedTotalAfterTaxes(rows: FreelancerTaxesRow[]): number {
	return sum(
		rows.map((row) => {
			const yearlyRevenue = getFreelancerYearlyRevenue(row)
			return yearlyRevenue * (1 - FreelanceTaxRate)
		})
	)
}

export function getFreelancerYearlyRevenue(row: FreelancerTaxesRow): number {
	return row.hourlyRate * row.hoursPerDay * row.daysPerYear
}
