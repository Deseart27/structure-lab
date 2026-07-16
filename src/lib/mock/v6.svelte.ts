// V6 Mock Data Store — shared reactive state for cross-page flows

export type EmailStatus = 'valid' | 'catch-all' | 'invalid-found' | 'not-found' | 'pending';
export type JobSource = 'csv' | 'manual' | 'reverse' | 'crm' | 'search-batch' | 'search-inline';
export type JobStatus = 'queued' | 'running' | 'completed' | 'completed-errors';

export interface Contact {
	id: string;
	firstName: string;
	lastName: string;
	company: string;
	title: string;
	email: string;
	emailStatus: EmailStatus;
	phone: string;
	personalEmail: string;
	linkedinUrl: string;
	location: string;
}

export interface Job {
	id: string;
	source: JobSource;
	name: string;
	contacts: Contact[];
	progress: number;
	status: JobStatus;
	date: string;
}

export interface V6List {
	id: string;
	type: 'people' | 'company';
	name: string;
	memberIds: string[];
	sources: string[];
	owner: string;
	updatedAt: string;
	enrichedPercent: number;
	enrichmentStatus?: 'enriching' | 'idle';
}

export interface Company {
	id: string;
	name: string;
	domain: string;
	industry: string;
	headcount: number;
	location: string;
	yearFounded: number;
	type: string;
	fundingUnlocked: boolean;
	financialsUnlocked: boolean;
	funding?: { round: string; amount: string; date: string; totalRaised: string; investors: string[] };
	financials?: { revenue: string; growth: string; employeesTrend: string };
}

export interface Push {
	id: string;
	date: string;
	source: string;
	sourceName: string;
	contactsCount: number;
	status: 'completed' | 'syncing' | 'failed';
}

export interface EnrichmentRun {
	id: string;
	listId: string;
	listName: string;
	outputType: 'emails' | 'phones' | 'reverse' | 'all';
	inputMethod: 'csv' | 'manual' | 'crm' | 'list' | 'search';
	contactsCount: number;
	found: number;
	status: 'running' | 'completed' | 'queued';
	progress: number;
	startedAt: string;
}

// --- Contacts pool ---

const contactsPool: Contact[] = [
	{ id: 'c1', firstName: 'Jean', lastName: 'Morel', company: 'Alan', title: 'Head of Sales', email: 'jean.morel@alan.com', emailStatus: 'valid', phone: '+33 6 12 34 56 78', personalEmail: '', linkedinUrl: 'linkedin.com/in/jeanmorel', location: 'Paris, France' },
	{ id: 'c2', firstName: 'Clara', lastName: 'Fontaine', company: 'Pennylane', title: 'VP Marketing', email: 'clara.f@pennylane.com', emailStatus: 'valid', phone: '+33 6 98 76 54 32', personalEmail: 'clara.fontaine@gmail.com', linkedinUrl: 'linkedin.com/in/clarafontaine', location: 'Paris, France' },
	{ id: 'c3', firstName: 'Marc', lastName: 'Dupont', company: 'Qonto', title: 'CRO', email: 'marc.dupont@qonto.com', emailStatus: 'catch-all', phone: '+33 7 11 22 33 44', personalEmail: '', linkedinUrl: 'linkedin.com/in/marcdupont', location: 'Paris, France' },
	{ id: 'c4', firstName: 'Sophie', lastName: 'Laurent', company: 'Spendesk', title: 'Sales Director', email: 'sophie.l@spendesk.com', emailStatus: 'valid', phone: '+33 6 55 44 33 22', personalEmail: '', linkedinUrl: 'linkedin.com/in/sophielaurent', location: 'Paris, France' },
	{ id: 'c5', firstName: 'Thomas', lastName: 'Bernard', company: 'PayFit', title: 'VP Sales', email: 'thomas.b@payfit.com', emailStatus: 'valid', phone: '+33 7 66 55 44 33', personalEmail: 'tbernard@outlook.fr', linkedinUrl: 'linkedin.com/in/thomasbernard', location: 'Paris, France' },
	{ id: 'c6', firstName: 'Lukas', lastName: 'Weber', company: 'Personio', title: 'Head of Sales DACH', email: 'lukas.weber@personio.de', emailStatus: 'valid', phone: '+49 170 123 4567', personalEmail: '', linkedinUrl: 'linkedin.com/in/lukasweber', location: 'Munich, Germany' },
	{ id: 'c7', firstName: 'Anna', lastName: 'Schmidt', company: 'Celonis', title: 'VP Sales', email: 'anna.schmidt@celonis.com', emailStatus: 'valid', phone: '+49 171 234 5678', personalEmail: '', linkedinUrl: 'linkedin.com/in/annaschmidt', location: 'Munich, Germany' },
	{ id: 'c8', firstName: 'Felix', lastName: 'Braun', company: 'Forto', title: 'CRO', email: 'felix.braun@forto.com', emailStatus: 'invalid-found', phone: '', personalEmail: '', linkedinUrl: 'linkedin.com/in/felixbraun', location: 'Berlin, Germany' },
	{ id: 'c9', firstName: 'Marie', lastName: 'Lefebvre', company: 'Doctolib', title: 'Sales Manager', email: 'marie.l@doctolib.com', emailStatus: 'valid', phone: '+33 6 77 88 99 00', personalEmail: '', linkedinUrl: 'linkedin.com/in/marielefebvre', location: 'Paris, France' },
	{ id: 'c10', firstName: 'Hugo', lastName: 'Martin', company: 'Swile', title: 'Account Executive', email: 'hugo.m@swile.co', emailStatus: 'valid', phone: '+33 7 22 33 44 55', personalEmail: '', linkedinUrl: 'linkedin.com/in/hugomartin', location: 'Montpellier, France' },
	{ id: 'c11', firstName: 'Elena', lastName: 'Rossi', company: 'Scalapay', title: 'VP Sales', email: '', emailStatus: 'not-found', phone: '', personalEmail: '', linkedinUrl: 'linkedin.com/in/elenarossi', location: 'Milan, Italy' },
	{ id: 'c12', firstName: 'Pablo', lastName: 'Garcia', company: 'Factorial', title: 'Head of Revenue', email: 'pablo.g@factorial.co', emailStatus: 'valid', phone: '+34 612 345 678', personalEmail: '', linkedinUrl: 'linkedin.com/in/pablogarcia', location: 'Barcelona, Spain' },
	{ id: 'c13', firstName: 'Camille', lastName: 'Petit', company: 'Algolia', title: 'Sales Director', email: 'camille.p@algolia.com', emailStatus: 'valid', phone: '+33 6 11 22 33 44', personalEmail: '', linkedinUrl: 'linkedin.com/in/camillepetit', location: 'Paris, France' },
	{ id: 'c14', firstName: 'David', lastName: 'Chen', company: 'Contentsquare', title: 'VP Sales EMEA', email: 'david.chen@contentsquare.com', emailStatus: 'invalid-found', phone: '+33 7 99 88 77 66', personalEmail: '', linkedinUrl: 'linkedin.com/in/davidchen-cs', location: 'Paris, France' },
	{ id: 'c15', firstName: 'Lisa', lastName: 'Muller', company: 'Babbel', title: 'Head of B2B Sales', email: 'lisa.muller@babbel.com', emailStatus: 'valid', phone: '+49 160 987 6543', personalEmail: '', linkedinUrl: 'linkedin.com/in/lisamuller', location: 'Berlin, Germany' },
	// Reverse contacts
	{ id: 'c16', firstName: 'Antoine', lastName: 'Roux', company: 'MirakI', title: 'CEO', email: 'antoine.roux@mirakl.com', emailStatus: 'valid', phone: '+33 6 44 55 66 77', personalEmail: '', linkedinUrl: 'linkedin.com/in/antoineroux', location: 'Paris, France' },
	{ id: 'c17', firstName: 'Juliette', lastName: 'Moreau', company: 'Dataiku', title: 'CMO', email: 'juliette.m@dataiku.com', emailStatus: 'valid', phone: '', personalEmail: 'juliette.moreau@gmail.com', linkedinUrl: 'linkedin.com/in/juliettemoreau', location: 'Paris, France' },
	{ id: 'c18', firstName: 'Maxime', lastName: 'Duval', company: 'Lydia', title: 'VP Growth', email: 'maxime.d@lydia.com', emailStatus: 'catch-all', phone: '+33 7 88 77 66 55', personalEmail: '', linkedinUrl: 'linkedin.com/in/maximeduval', location: 'Paris, France' },
];

// --- Jobs ---

let jobs = $state<Job[]>([
	{
		id: 'j1', source: 'csv', name: 'leads_q3.csv',
		contacts: [contactsPool[0], contactsPool[1], contactsPool[2], contactsPool[3], contactsPool[4], contactsPool[8], contactsPool[9], contactsPool[10], contactsPool[11], contactsPool[12], contactsPool[13], contactsPool[14]],
		progress: 100, status: 'completed', date: '2 hours ago',
	},
	{
		id: 'j2', source: 'search-inline', name: 'VP Sales · SaaS · France',
		contacts: [contactsPool[0], contactsPool[3], contactsPool[4]],
		progress: 100, status: 'completed', date: '5 hours ago',
	},
	{
		id: 'j3', source: 'search-batch', name: 'Outbound DACH batch',
		contacts: [contactsPool[5], contactsPool[6], contactsPool[7], contactsPool[14]],
		progress: 64, status: 'running', date: '12 min ago',
	},
	{
		id: 'j4', source: 'reverse', name: 'Reverse - webinar signups',
		contacts: [contactsPool[15], contactsPool[16], contactsPool[17]],
		progress: 100, status: 'completed', date: '1 day ago',
	},
	{
		id: 'j5', source: 'crm', name: 'HubSpot - Cold leads 2025',
		contacts: [contactsPool[8], contactsPool[9], contactsPool[10]],
		progress: 100, status: 'completed-errors', date: '3 days ago',
	},
	{
		id: 'j6', source: 'manual', name: 'Manual - event badges',
		contacts: [contactsPool[12], contactsPool[13]],
		progress: 0, status: 'queued', date: '5 min ago',
	},
]);

// --- Lists ---

let lists = $state<V6List[]>([
	{ id: 'l1', type: 'people', name: 'Q3 Targets', memberIds: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c9'], sources: ['search', 'csv'], owner: 'Francis', updatedAt: '1 hour ago', enrichedPercent: 86, enrichmentStatus: 'idle' },
	{ id: 'l2', type: 'company', name: 'ABM - Fintech FR', memberIds: ['comp1', 'comp3', 'comp5', 'comp8'], sources: ['search'], owner: 'Francis', updatedAt: '2 days ago', enrichedPercent: 0, enrichmentStatus: 'idle' },
	{ id: 'l3', type: 'people', name: 'Webinar attendees', memberIds: ['c16', 'c17', 'c18'], sources: ['reverse'], owner: 'Marie', updatedAt: '1 day ago', enrichedPercent: 100, enrichmentStatus: 'idle' },
	{ id: 'l4', type: 'people', name: 'Sales Leaders DACH', memberIds: ['c6', 'c7', 'c8', 'c15'], sources: ['search', 'manual'], owner: 'Francis', updatedAt: '5 days ago', enrichedPercent: 75, enrichmentStatus: 'enriching' },
]);

// --- Companies ---

let companies = $state<Company[]>([
	{ id: 'comp1', name: 'Doctolib', domain: 'doctolib.fr', industry: 'HealthTech', headcount: 2800, location: 'Paris, France', yearFounded: 2013, type: 'Private', fundingUnlocked: true, financialsUnlocked: false, funding: { round: 'Series F', amount: '500M', date: 'Mar 2024', totalRaised: '900M', investors: ['Eurazeo', 'Bpifrance', 'General Atlantic'] } },
	{ id: 'comp2', name: 'Pennylane', domain: 'pennylane.com', industry: 'FinTech', headcount: 450, location: 'Paris, France', yearFounded: 2020, type: 'Private', fundingUnlocked: true, financialsUnlocked: true, funding: { round: 'Series C', amount: '40M', date: 'Jan 2025', totalRaised: '84M', investors: ['Sequoia', 'DST Global', 'Global Founders Capital'] }, financials: { revenue: '20-50M', growth: '+120% YoY', employeesTrend: '+60% in 12 months' } },
	{ id: 'comp3', name: 'Qonto', domain: 'qonto.com', industry: 'FinTech', headcount: 1400, location: 'Paris, France', yearFounded: 2016, type: 'Private', fundingUnlocked: false, financialsUnlocked: false },
	{ id: 'comp4', name: 'Alan', domain: 'alan.com', industry: 'InsurTech', headcount: 600, location: 'Paris, France', yearFounded: 2016, type: 'Private', fundingUnlocked: false, financialsUnlocked: false },
	{ id: 'comp5', name: 'Spendesk', domain: 'spendesk.com', industry: 'FinTech', headcount: 350, location: 'Paris, France', yearFounded: 2016, type: 'Private', fundingUnlocked: false, financialsUnlocked: false },
	{ id: 'comp6', name: 'PayFit', domain: 'payfit.com', industry: 'HR Technology', headcount: 1100, location: 'Paris, France', yearFounded: 2015, type: 'Private', fundingUnlocked: false, financialsUnlocked: false },
	{ id: 'comp7', name: 'Personio', domain: 'personio.de', industry: 'HR Technology', headcount: 2000, location: 'Munich, Germany', yearFounded: 2015, type: 'Private', fundingUnlocked: false, financialsUnlocked: false },
	{ id: 'comp8', name: 'Swile', domain: 'swile.co', industry: 'FinTech', headcount: 700, location: 'Montpellier, France', yearFounded: 2018, type: 'Private', fundingUnlocked: false, financialsUnlocked: false },
	{ id: 'comp9', name: 'Algolia', domain: 'algolia.com', industry: 'Software', headcount: 800, location: 'Paris, France', yearFounded: 2012, type: 'Private', fundingUnlocked: false, financialsUnlocked: false },
	{ id: 'comp10', name: 'Contentsquare', domain: 'contentsquare.com', industry: 'Software', headcount: 1800, location: 'Paris, France', yearFounded: 2012, type: 'Private', fundingUnlocked: false, financialsUnlocked: false },
]);

// --- Enrichment Runs ---

let runs = $state<EnrichmentRun[]>([
	{ id: 'r1', listId: 'l1', listName: 'Q3 Targets', outputType: 'emails', inputMethod: 'csv', contactsCount: 234, found: 198, status: 'completed', progress: 100, startedAt: '2 hours ago' },
	{ id: 'r2', listId: 'l4', listName: 'Sales Leaders DACH', outputType: 'phones', inputMethod: 'search', contactsCount: 45, found: 21, status: 'running', progress: 64, startedAt: '12 min ago' },
	{ id: 'r3', listId: 'l1', listName: 'Q3 Targets', outputType: 'all', inputMethod: 'csv', contactsCount: 156, found: 72, status: 'completed', progress: 100, startedAt: '1 day ago' },
	{ id: 'r4', listId: 'l3', listName: 'Webinar attendees', outputType: 'reverse', inputMethod: 'csv', contactsCount: 67, found: 52, status: 'completed', progress: 100, startedAt: '2 days ago' },
	{ id: 'r5', listId: 'l4', listName: 'Sales Leaders DACH', outputType: 'emails', inputMethod: 'manual', contactsCount: 12, found: 0, status: 'queued', progress: 0, startedAt: '5 min ago' },
]);

// --- Pushes ---

let pushes = $state<Push[]>([
	{ id: 'p1', date: '2 hours ago', source: 'Job', sourceName: 'leads_q3.csv', contactsCount: 12, status: 'completed' },
	{ id: 'p2', date: '1 day ago', source: 'Search', sourceName: 'VP Sales · SaaS · France', contactsCount: 5, status: 'completed' },
	{ id: 'p3', date: '3 days ago', source: 'List', sourceName: 'Q3 Targets', contactsCount: 7, status: 'completed' },
	{ id: 'p4', date: '1 week ago', source: 'Job', sourceName: 'HubSpot - Cold leads 2025', contactsCount: 3, status: 'failed' },
]);

// --- Store export ---

export const v6Store = {
	get jobs() { return jobs; },
	get lists() { return lists; },
	get companies() { return companies; },
	get pushes() { return pushes; },
	get contacts() { return contactsPool; },
	get runs() { return runs; },

	getJob(id: string) { return jobs.find(j => j.id === id); },
	getList(id: string) { return lists.find(l => l.id === id); },
	getCompany(id: string) { return companies.find(c => c.id === id); },

	getContactsForList(list: V6List): Contact[] {
		return list.memberIds.map(id => contactsPool.find(c => c.id === id)).filter(Boolean) as Contact[];
	},

	addJob(job: Job) {
		jobs = [job, ...jobs];
	},

	addPush(push: Push) {
		pushes = [push, ...pushes];
	},

	addRun(run: EnrichmentRun) { runs = [run, ...runs]; },
	getRunsForList(listId: string): EnrichmentRun[] { return runs.filter(r => r.listId === listId); },

	unlockFunding(companyId: string) {
		companies = companies.map(c => {
			if (c.id !== companyId) return c;
			return {
				...c,
				fundingUnlocked: true,
				funding: c.funding ?? { round: 'Series B', amount: '30M', date: 'Jan 2026', totalRaised: '52M', investors: ['Accel', 'Index Ventures', 'Partech'] },
			};
		});
	},

	unlockFinancials(companyId: string) {
		companies = companies.map(c => {
			if (c.id !== companyId) return c;
			return {
				...c,
				financialsUnlocked: true,
				financials: c.financials ?? { revenue: '10-20M', growth: '+85% YoY', employeesTrend: '+40% in 12 months' },
			};
		});
	},

	searchContacts(query: string): { contact: Contact; provenances: { type: string; name: string; id: string }[] }[] {
		const q = query.toLowerCase();
		const results: { contact: Contact; provenances: { type: string; name: string; id: string }[] }[] = [];
		const seen = new Set<string>();

		for (const contact of contactsPool) {
			const match = `${contact.firstName} ${contact.lastName} ${contact.company} ${contact.email} ${contact.title}`.toLowerCase().includes(q);
			if (!match || seen.has(contact.id)) continue;
			seen.add(contact.id);

			const provenances: { type: string; name: string; id: string }[] = [];
			for (const job of jobs) {
				if (job.contacts.some(c => c.id === contact.id)) {
					const sourceLabel = job.source === 'csv' ? 'CSV' : job.source === 'search-inline' ? 'Search' : job.source === 'search-batch' ? 'Search' : job.source === 'reverse' ? 'Reverse' : job.source === 'crm' ? 'CRM' : 'Manual';
					provenances.push({ type: sourceLabel, name: job.name, id: job.id });
				}
			}
			for (const list of lists) {
				if (list.memberIds.includes(contact.id)) {
					provenances.push({ type: 'List', name: list.name, id: list.id });
				}
			}
			if (provenances.length > 0) results.push({ contact, provenances });
		}
		return results;
	},
};
