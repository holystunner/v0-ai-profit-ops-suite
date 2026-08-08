// Real CrewAI catalog imported from the user's CrewAI project:
// "QuickstartEliteProfitOps72HourLaunchCrew" (project_id: 3fdcaa0d-6545-4770-b793-e0f765ca171c)
// Source: config/agents.yaml, config/tasks.yaml, crew.py
//
// This is the source-of-truth catalog surfaced in the dashboard's visual library.
// Agents, their tools, and the sequential task pipeline are all derived from the
// actual crew definition so what you see here matches what runs in CrewAI.

export type CrewToolId =
  | "FileReadTool"
  | "EXASearchTool"
  | "ScrapeWebsiteTool"
  | "StagehandTool"
  | "StripeApps"

export interface CrewToolMeta {
  id: CrewToolId
  label: string
  category: "browser" | "search" | "files" | "payments" | "scraping"
  description: string
  /** Whether this tool drives a real browser (Playwright/Stagehand) */
  browser: boolean
}

export const CREW_TOOLS: Record<CrewToolId, CrewToolMeta> = {
  StagehandTool: {
    id: "StagehandTool",
    label: "Stagehand (Browser)",
    category: "browser",
    description:
      "Playwright-backed browser automation. Navigates, clicks, fills forms, posts content, and deploys — real web actions.",
    browser: true,
  },
  EXASearchTool: {
    id: "EXASearchTool",
    label: "Exa Search",
    category: "search",
    description: "Live web search for research, competitor intel, and lead discovery.",
    browser: false,
  },
  ScrapeWebsiteTool: {
    id: "ScrapeWebsiteTool",
    label: "Website Scraper",
    category: "scraping",
    description: "Scrapes pricing pages, competitor sites, and public web content.",
    browser: false,
  },
  FileReadTool: {
    id: "FileReadTool",
    label: "File Reader",
    category: "files",
    description: "Reads uploaded files — brand bibles, handoff docs, specs, and assets.",
    browser: false,
  },
  StripeApps: {
    id: "StripeApps",
    label: "Stripe Actions",
    category: "payments",
    description:
      "Creates products, prices, payment links, checkout sessions, and audits balance transactions in Stripe.",
    browser: false,
  },
}

export interface CrewAgentTemplate {
  /** CrewAI yaml key */
  key: string
  name: string
  role: string
  goal: string
  backstory: string
  tools: CrewToolId[]
  /** provider/model string used in the CrewAI config */
  model: string
  /** dashboard hierarchy role this template maps to */
  tier: "project-manager" | "worker"
}

export const CREW_AGENTS: CrewAgentTemplate[] = [
  {
    key: "project_commander_sprint_strategist",
    name: "Project Commander",
    role: "Project Commander & Sprint Strategist",
    goal: "Parse the brand bible and translate it into a battle-ready 3-sprint execution plan. Extract all credentials, assets, positioning, and profit targets. Maximize profit within 72 hours with $0 ad spend.",
    backstory:
      "A seasoned startup operator and growth hacker who has launched 50+ products from zero to revenue in under 72 hours. Thinks in sprints, moves with urgency, digests a brand bible like a war brief.",
    tools: ["FileReadTool", "EXASearchTool"],
    model: "openai/gpt-4o-mini",
    tier: "project-manager",
  },
  {
    key: "offer_architect_market_intelligence_analyst",
    name: "Offer Architect",
    role: "Offer Architect & Market Intelligence Analyst",
    goal: "Design a high-converting, irresistible offer using brand directives and live competitor intelligence. Define pricing tiers, value stacks, urgency hooks, and the core narrative.",
    backstory:
      "A conversion-obsessed offer engineer with deep roots in copywriting, pricing psychology, and competitive strategy. Has architected 7-figure offers from scratch in 24 hours.",
    tools: ["EXASearchTool", "ScrapeWebsiteTool"],
    model: "openai/gpt-4o-mini",
    tier: "worker",
  },
  {
    key: "finance_stripe_setup_engineer",
    name: "Finance & Stripe Engineer",
    role: "Finance & Stripe Setup Engineer",
    goal: "Configure Stripe from scratch — products, pricing tiers, payment links, and checkout sessions. Track all revenue transactions across the sprint and report financial performance.",
    backstory:
      "A fintech-savvy operator who has set up payment infrastructure for hundreds of digital products. Knows Stripe inside out and is obsessive about tracking every dollar.",
    tools: ["StripeApps"],
    model: "openai/gpt-4o-mini",
    tier: "worker",
  },
  {
    key: "dev_landing_page_deployment_agent",
    name: "Dev & Deployment Agent",
    role: "Dev & Landing Page Deployment Agent",
    goal: "Rapidly customize and deploy the landing page template using brand specs. Integrate the Stripe payment link, configure the custom domain, and ship a live, fast, converting page.",
    backstory:
      "A full-stack dev and no-code operator who launches conversion-optimized landing pages in hours. Uses browser automation to configure, preview, and deploy with precision.",
    tools: ["StagehandTool", "FileReadTool"],
    model: "openai/gpt-4o-mini",
    tier: "worker",
  },
  {
    key: "live_sales_outreach_lead_conversion_agent",
    name: "Sales Outreach Agent",
    role: "Live Sales Outreach & Lead Conversion Agent",
    goal: "Execute aggressive, personalized live sales outreach across DMs, emails, comment threads, and communities. Find warm/cold leads, craft messages, and drive them to the payment link.",
    backstory:
      "An elite digital sales operator — part SDR, part growth hacker, part closer. Has driven six figures through pure outreach in 72-hour sprints with zero ad spend.",
    tools: ["StagehandTool", "EXASearchTool"],
    model: "openai/gpt-4o-mini",
    tier: "worker",
  },
  {
    key: "pr_branding_community_launch_strategist",
    name: "PR & Community Strategist",
    role: "PR, Branding & Community Launch Strategist",
    goal: "Build and deploy the full brand narrative, PR positioning, and community launch strategy. Identify and infiltrate the highest-leverage online communities where the ideal buyer lives.",
    backstory:
      "An elite launch strategist and brand storyteller who has taken dozens of products from zero to viral in under 72 hours using pure organic PR and community seeding.",
    tools: ["EXASearchTool", "ScrapeWebsiteTool"],
    model: "openai/gpt-4o-mini",
    tier: "worker",
  },
  {
    key: "social_media_content_blitz_agent",
    name: "Social Content Blitz Agent",
    role: "Social Media & Content Blitz Agent",
    goal: "Create and execute a high-impact 3-day social media content blitz across Twitter/X, Instagram, LinkedIn, and TikTok. Publish Day 1 launch content live using provided credentials.",
    backstory:
      "A viral content machine at the intersection of elite aesthetics, sharp copy, and conversion psychology. Ships Day 1 content within hours of handoff.",
    tools: ["StagehandTool", "EXASearchTool"],
    model: "openai/gpt-4o-mini",
    tier: "worker",
  },
  {
    key: "site_architect_visual_design_agent",
    name: "Site Architect & Designer",
    role: "Site Architect & Visual Design Agent",
    goal: "Own the end-to-end site and visual design — from brand inspiration through Canva design execution to deploying a fully customized, live, conversion-ready website with an embedded Stripe link.",
    backstory:
      "A rare hybrid — part creative director, part front-end dev, part no-code operator. Has designed and shipped hundreds of brand sites in 24–48 hours.",
    tools: ["StagehandTool", "FileReadTool", "ScrapeWebsiteTool"],
    model: "openai/gpt-4o-mini",
    tier: "worker",
  },
]

export interface CrewTaskTemplate {
  key: string
  title: string
  agentKey: string
  /** task keys this task depends on (context in CrewAI) */
  dependsOn: string[]
}

// The 11-task sequential pipeline from tasks.yaml, in execution order.
export const CREW_TASKS: CrewTaskTemplate[] = [
  {
    key: "parse_brand_bible_generate_sprint_execution_plan",
    title: "Parse Brand Bible & Generate Sprint Plan",
    agentKey: "project_commander_sprint_strategist",
    dependsOn: [],
  },
  {
    key: "competitor_research_market_intelligence_report",
    title: "Competitor Research & Market Intelligence",
    agentKey: "offer_architect_market_intelligence_analyst",
    dependsOn: ["parse_brand_bible_generate_sprint_execution_plan"],
  },
  {
    key: "design_elite_offer_architecture_sales_narrative",
    title: "Design Offer Architecture & Sales Narrative",
    agentKey: "offer_architect_market_intelligence_analyst",
    dependsOn: [
      "parse_brand_bible_generate_sprint_execution_plan",
      "competitor_research_market_intelligence_report",
    ],
  },
  {
    key: "configure_stripe_payment_infrastructure",
    title: "Configure Stripe Payment Infrastructure",
    agentKey: "finance_stripe_setup_engineer",
    dependsOn: ["design_elite_offer_architecture_sales_narrative"],
  },
  {
    key: "build_brand_identity_pr_narrative_press_assets",
    title: "Build Brand Identity & PR Assets",
    agentKey: "pr_branding_community_launch_strategist",
    dependsOn: [
      "parse_brand_bible_generate_sprint_execution_plan",
      "design_elite_offer_architecture_sales_narrative",
    ],
  },
  {
    key: "design_build_full_brand_site",
    title: "Design & Build Full Brand Site",
    agentKey: "site_architect_visual_design_agent",
    dependsOn: [
      "parse_brand_bible_generate_sprint_execution_plan",
      "design_elite_offer_architecture_sales_narrative",
      "configure_stripe_payment_infrastructure",
    ],
  },
  {
    key: "prospect_research_lead_list_build",
    title: "Prospect Research & Lead List Build",
    agentKey: "live_sales_outreach_lead_conversion_agent",
    dependsOn: [
      "design_elite_offer_architecture_sales_narrative",
      "competitor_research_market_intelligence_report",
      "build_brand_identity_pr_narrative_press_assets",
    ],
  },
  {
    key: "final_site_qa_domain_config_go_live",
    title: "Final Site QA, Domain Config & Go-Live",
    agentKey: "dev_landing_page_deployment_agent",
    dependsOn: ["design_build_full_brand_site", "configure_stripe_payment_infrastructure"],
  },
  {
    key: "create_3_day_social_media_content_campaign",
    title: "Create 3-Day Social Media Campaign",
    agentKey: "social_media_content_blitz_agent",
    dependsOn: [
      "build_brand_identity_pr_narrative_press_assets",
      "design_elite_offer_architecture_sales_narrative",
      "final_site_qa_domain_config_go_live",
    ],
  },
  {
    key: "execute_live_sales_outreach_campaign",
    title: "Execute Live Sales Outreach Campaign",
    agentKey: "live_sales_outreach_lead_conversion_agent",
    dependsOn: [
      "prospect_research_lead_list_build",
      "configure_stripe_payment_infrastructure",
      "final_site_qa_domain_config_go_live",
      "create_3_day_social_media_content_campaign",
    ],
  },
  {
    key: "sprint_performance_report_revenue_audit",
    title: "72-Hour Sprint Performance Report & Revenue Audit",
    agentKey: "finance_stripe_setup_engineer",
    dependsOn: [
      "execute_live_sales_outreach_campaign",
      "create_3_day_social_media_content_campaign",
      "configure_stripe_payment_infrastructure",
    ],
  },
]

export const CREW_META = {
  name: "Elite Profit Ops — 72-Hour Launch Crew",
  projectId: "3fdcaa0d-6545-4770-b793-e0f765ca171c",
  process: "sequential" as const,
  source: "CrewAI",
  inputs: ["project_name", "brand_bible_path"],
}
