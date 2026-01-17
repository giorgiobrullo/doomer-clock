export const LIFE_EXPECTANCY = 78;
export const WEEKS_PER_YEAR = 52;
export const TOTAL_WEEKS = LIFE_EXPECTANCY * WEEKS_PER_YEAR;

export interface Person {
	id: string;
	label: string;
	age: number;
	relationship: 'self' | 'parent' | 'grandparent' | 'child';
}

export interface Pet {
	id: string;
	name: string;
	type: 'dog' | 'cat';
	age: number;
}

export interface PetStats {
	pet: Pet;
	lifeExpectancy: number;
	yearsRemaining: number;
	percentLived: number;
	diesBeforeYou: boolean;
	yourAgeWhenTheyDie: number;
}

export interface MortalityData {
	user: Person;
	parents: Person[];
	grandparents: Person[];
	children: Person[];
	pets: Pet[];
}

// Pet life expectancies
export const DOG_LIFE_EXPECTANCY = 12;
export const CAT_LIFE_EXPECTANCY = 15;

export interface TimeRemaining {
	years: number;
	months: number;
	weeks: number;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}

export interface PersonStats {
	person: Person;
	weeksLived: number;
	weeksRemaining: number;
	percentLived: number;
	yearsRemaining: number;
	sharedWeeksRemaining: number;
	sharedYearsRemaining: number;
	summersRemaining: number;
	christmasesRemaining: number;
}

export function calculateWeeksLived(age: number): number {
	return Math.floor(age * WEEKS_PER_YEAR);
}

export function calculateWeeksRemaining(age: number): number {
	const remaining = (LIFE_EXPECTANCY - age) * WEEKS_PER_YEAR;
	return Math.max(0, Math.floor(remaining));
}

export function calculateYearsRemaining(age: number): number {
	return Math.max(0, LIFE_EXPECTANCY - age);
}

export function calculatePercentLived(age: number): number {
	return Math.min(100, (age / LIFE_EXPECTANCY) * 100);
}

export function calculateSharedTimeRemaining(userAge: number, otherPersonAge: number): number {
	const userYearsRemaining = calculateYearsRemaining(userAge);
	const otherYearsRemaining = calculateYearsRemaining(otherPersonAge);
	return Math.min(userYearsRemaining, otherYearsRemaining);
}

export function calculateTimeRemaining(age: number): TimeRemaining {
	const totalSecondsRemaining = Math.max(0, (LIFE_EXPECTANCY - age) * 365.25 * 24 * 60 * 60);

	const years = Math.floor(totalSecondsRemaining / (365.25 * 24 * 60 * 60));
	const months = Math.floor((totalSecondsRemaining % (365.25 * 24 * 60 * 60)) / (30.44 * 24 * 60 * 60));
	const weeks = Math.floor((totalSecondsRemaining % (30.44 * 24 * 60 * 60)) / (7 * 24 * 60 * 60));
	const days = Math.floor((totalSecondsRemaining % (7 * 24 * 60 * 60)) / (24 * 60 * 60));
	const hours = Math.floor((totalSecondsRemaining % (24 * 60 * 60)) / (60 * 60));
	const minutes = Math.floor((totalSecondsRemaining % (60 * 60)) / 60);
	const seconds = Math.floor(totalSecondsRemaining % 60);

	return { years, months, weeks, days, hours, minutes, seconds };
}

export function calculatePersonStats(person: Person, userAge: number): PersonStats {
	const weeksLived = calculateWeeksLived(person.age);
	const weeksRemaining = calculateWeeksRemaining(person.age);
	const percentLived = calculatePercentLived(person.age);
	const yearsRemaining = calculateYearsRemaining(person.age);
	const sharedYearsRemaining = calculateSharedTimeRemaining(userAge, person.age);
	const sharedWeeksRemaining = sharedYearsRemaining * WEEKS_PER_YEAR;
	const summersRemaining = sharedYearsRemaining;
	const christmasesRemaining = sharedYearsRemaining;

	return {
		person,
		weeksLived,
		weeksRemaining,
		percentLived,
		yearsRemaining,
		sharedWeeksRemaining,
		sharedYearsRemaining,
		summersRemaining,
		christmasesRemaining
	};
}

export function generateId(): string {
	return Math.random().toString(36).substring(2, 9);
}

// Calculate quality time (excluding sleep, work, etc.)
// Assumes ~4 hours of real quality time per day on average with loved ones
export function calculateQualityWeeks(sharedYears: number): number {
	const qualityHoursPerWeek = 10; // ~1.5 hours per day of real quality time
	const totalQualityHours = sharedYears * 52 * qualityHoursPerWeek;
	return Math.round(totalQualityHours / 168); // Convert to "full weeks" of time
}

// Calculate how old a child will be when parent dies
export function calculateChildAgeAtParentDeath(childAge: number, parentAge: number): number {
	const parentYearsRemaining = Math.max(0, LIFE_EXPECTANCY - parentAge);
	return childAge + parentYearsRemaining;
}

// Calculate how much time you'd have with a hypothetical future child
export function calculateFutureChildTime(currentAge: number, ageAtBirth: number): {
	yearsWithChild: number;
	childAgeAtYourDeath: number;
} {
	const yearsUntilBirth = ageAtBirth - currentAge;
	const yearsWithChild = Math.max(0, LIFE_EXPECTANCY - ageAtBirth);
	const childAgeAtYourDeath = yearsWithChild;
	return { yearsWithChild, childAgeAtYourDeath };
}

// Calculate pet statistics
export function calculatePetStats(pet: Pet, userAge: number): PetStats {
	const lifeExpectancy = pet.type === 'dog' ? DOG_LIFE_EXPECTANCY : CAT_LIFE_EXPECTANCY;
	const yearsRemaining = Math.max(0, lifeExpectancy - pet.age);
	const percentLived = Math.min(100, (pet.age / lifeExpectancy) * 100);
	const userYearsRemaining = Math.max(0, LIFE_EXPECTANCY - userAge);
	const diesBeforeYou = yearsRemaining < userYearsRemaining;
	const yourAgeWhenTheyDie = userAge + yearsRemaining;

	return {
		pet,
		lifeExpectancy,
		yearsRemaining,
		percentLived,
		diesBeforeYou,
		yourAgeWhenTheyDie
	};
}
