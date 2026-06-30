<script lang="ts">
	const mcpTools = [
		{ name: 'Claude', icon: 'smart_toy', desc: 'Use FullEnrich directly in Claude Desktop' },
		{ name: 'ChatGPT', icon: 'chat', desc: 'Integrate with ChatGPT for AI-powered enrichment' },
		{ name: 'Manus', icon: 'precision_manufacturing', desc: 'Connect FullEnrich to Manus AI agent' },
	];

	const workflows = [
		{ name: 'Make', color: '#6d3bf5' },
		{ name: 'Zapier', color: '#ff4a00' },
		{ name: 'Clay', color: '#2563eb' },
		{ name: 'Cargo', color: '#1a1a2e' },
		{ name: 'n8n', color: '#ea4b71' },
	];

	const crms = [
		{ name: 'HubSpot', color: '#ff7a59' },
		{ name: 'Salesforce', color: '#00a1e0' },
		{ name: 'Pipedrive', color: '#1a7a3c' },
	];

	const outreach = [
		{ name: 'Smartlead' }, { name: 'Instantly' }, { name: 'Lemlist' },
		{ name: 'HeyReach' }, { name: 'Salesloft' }, { name: 'Outreach' },
		{ name: 'LaGrowthMachine' }, { name: 'Reply.io' }, { name: 'GoHighLevel' },
		{ name: 'Saleshandy' }, { name: 'Snov.io' },
	];

	const sections = [
		{ id: 'mcp', label: 'MCP' },
		{ id: 'workflows', label: 'Workflow' },
		{ id: 'crm', label: 'CRM' },
		{ id: 'outreach', label: 'Outreach' },
	];
</script>

<div class="flex h-full overflow-auto">
	<div class="mx-auto mt-[72px] mb-[163px] flex flex-row content-center justify-center gap-[70px] px-8">
		<!-- Sticky Sidebar -->
		<nav class="sticky top-0 inline-flex h-[313px] w-24 flex-col self-start py-[100px]">
			{#each sections as section}
				<a
					href="#{section.id}"
					class="text-grey-700 hover:text-violet-800 inline-flex w-full items-center justify-start gap-7 rounded-lg px-3 py-2 text-sm font-medium hover:bg-[#EFEBFF]"
				>
					{section.label}
				</a>
			{/each}
		</nav>

		<!-- Main Content -->
		<div class="max-w-[900px] flex-1">
			<h1 class="text-grey-900 mb-8 text-[28px] font-semibold">Integrations</h1>

			<!-- MCP Section -->
			<section id="mcp" class="mb-12">
				<div class="mb-4 flex items-center gap-2">
					<h2 class="text-grey-900 text-lg font-semibold">MCP</h2>
					<span class="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-800">
						<span class="material-icons-round text-xs">auto_awesome</span>
						New
					</span>
				</div>

				<!-- MCP Hero Card -->
				<div class="border-violet-100 mb-6 w-full rounded-2xl border p-6 shadow" style="background: radial-gradient(ellipse at 20% 80%, rgba(219,219,255,0.4), transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(209,204,255,0.3), transparent 50%), #faf9ff;">
					<h3 class="text-grey-900 text-lg font-semibold">Use FullEnrich MCP in your favorite AI agents!</h3>
					<p class="text-grey-600 mt-2 text-sm">Connect FullEnrich to any AI agent that supports MCP protocol for seamless B2B data enrichment.</p>
					<div class="mt-4 flex items-center gap-3">
						<button class="btn-primary h-9 px-4 text-sm">Get Started</button>
						<div class="bg-grey-50 border-grey-200 flex items-center gap-2 rounded-lg border px-3 py-1.5">
							<code class="text-grey-700 text-xs">npx @anthropic/mcp-server-fullenrich</code>
							<button class="btn-tertiary flex h-6 w-6 items-center justify-center">
								<span class="material-icons-round text-grey-500 text-sm">content_copy</span>
							</button>
						</div>
					</div>
				</div>

				<div class="mb-6 flex gap-6">
					{#each mcpTools as tool}
						<div class="border-grey-200 hover:border-violet-200 flex flex-1 cursor-pointer flex-col items-center gap-3 rounded-xl border p-6 transition-colors hover:bg-violet-50/30">
							<span class="material-icons-round text-violet-700 text-3xl">{tool.icon}</span>
							<span class="text-grey-900 text-sm font-medium">{tool.name}</span>
							<span class="text-grey-500 text-center text-xs">{tool.desc}</span>
						</div>
					{/each}
				</div>
			</section>

			<!-- Workflows Section -->
			<section id="workflows" class="mb-12">
				<h2 class="text-grey-900 mb-4 text-lg font-semibold">Workflows</h2>
				<div class="grid grid-cols-3 gap-4">
					{#each workflows as wf}
						<div class="border-grey-200 hover:border-grey-300 flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors">
							<div class="flex h-10 w-10 items-center justify-center rounded-lg" style:background-color="{wf.color}15">
								<span class="material-icons-round text-lg" style:color={wf.color}>integration_instructions</span>
							</div>
							<div>
								<p class="text-grey-900 text-sm font-medium">{wf.name}</p>
								<p class="text-grey-500 text-xs">Connect</p>
							</div>
						</div>
					{/each}
				</div>
			</section>

			<!-- CRM Section -->
			<section id="crm" class="mb-12">
				<h2 class="text-grey-900 mb-4 text-lg font-semibold">CRM</h2>
				<div class="grid grid-cols-3 gap-4">
					{#each crms as crm}
						<div class="border-grey-200 hover:border-grey-300 flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors">
							<div class="flex h-10 w-10 items-center justify-center rounded-lg" style:background-color="{crm.color}15">
								<span class="material-icons-round text-lg" style:color={crm.color}>hub</span>
							</div>
							<div>
								<p class="text-grey-900 text-sm font-medium">{crm.name}</p>
								<p class="text-grey-500 text-xs">Connect</p>
							</div>
						</div>
					{/each}
				</div>
			</section>

			<!-- Outreach Section -->
			<section id="outreach" class="mb-12">
				<h2 class="text-grey-900 mb-4 text-lg font-semibold">Outreach</h2>
				<div class="grid grid-cols-3 gap-4">
					{#each outreach as tool}
						<div class="border-grey-200 hover:border-grey-300 flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors">
							<div class="bg-grey-100 flex h-10 w-10 items-center justify-center rounded-lg">
								<span class="material-icons-round text-grey-600 text-lg">campaign</span>
							</div>
							<div>
								<p class="text-grey-900 text-sm font-medium">{tool.name}</p>
								<p class="text-grey-500 text-xs">Connect</p>
							</div>
						</div>
					{/each}
				</div>
			</section>

			<!-- Request Integration -->
			<div class="border-grey-200 rounded-xl border p-6 text-center">
				<p class="text-grey-600 text-sm">Can't find what you're looking for?</p>
				<button class="btn-ghost mt-2 h-8 text-sm text-violet-700">Request an integration</button>
			</div>
		</div>
	</div>
</div>
