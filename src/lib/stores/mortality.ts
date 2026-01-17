import { writable, derived } from 'svelte/store';
import type { MortalityData, Person, PersonStats, Pet, PetStats } from '$lib/utils/calculations';
import { calculatePersonStats, calculatePetStats, generateId } from '$lib/utils/calculations';

function createMortalityStore() {
	const { subscribe, set, update } = writable<MortalityData | null>(null);

	return {
		subscribe,
		setData: (data: MortalityData) => set(data),
		clear: () => set(null),
		initialize: (userAge: number) => {
			set({
				user: {
					id: generateId(),
					label: 'You',
					age: userAge,
					relationship: 'self'
				},
				parents: [],
				grandparents: [],
				children: [],
				pets: []
			});
		},
		addParent: (age: number, label: string) => {
			update((data) => {
				if (!data) return data;
				data.parents.push({
					id: generateId(),
					label,
					age,
					relationship: 'parent'
				});
				return data;
			});
		},
		addGrandparent: (age: number, label: string) => {
			update((data) => {
				if (!data) return data;
				data.grandparents.push({
					id: generateId(),
					label,
					age,
					relationship: 'grandparent'
				});
				return data;
			});
		},
		addChild: (age: number, label: string) => {
			update((data) => {
				if (!data) return data;
				data.children.push({
					id: generateId(),
					label,
					age,
					relationship: 'child'
				});
				return data;
			});
		},
		addPet: (name: string, type: 'dog' | 'cat', age: number) => {
			update((data) => {
				if (!data) return data;
				data.pets.push({
					id: generateId(),
					name,
					type,
					age
				});
				return data;
			});
		}
	};
}

export const mortalityStore = createMortalityStore();

export const userStats = derived(mortalityStore, ($data): PersonStats | null => {
	if (!$data) return null;
	return calculatePersonStats($data.user, $data.user.age);
});

export const allPeopleStats = derived(mortalityStore, ($data): PersonStats[] => {
	if (!$data) return [];

	const userAge = $data.user.age;
	const stats: PersonStats[] = [];

	$data.parents.forEach((p) => stats.push(calculatePersonStats(p, userAge)));
	$data.grandparents.forEach((p) => stats.push(calculatePersonStats(p, userAge)));
	$data.children.forEach((p) => stats.push(calculatePersonStats(p, userAge)));

	return stats;
});

export const petStats = derived(mortalityStore, ($data): PetStats[] => {
	if (!$data) return [];

	const userAge = $data.user.age;
	return $data.pets.map((pet) => calculatePetStats(pet, userAge));
});
