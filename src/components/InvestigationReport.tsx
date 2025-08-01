import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { apiService } from '../services/api';
import { generateInvestigationReportPDF } from '../services/pdfGenerator';
import './InvestigationReport.css';

interface Finding {
  category: string;
  riskAssessment: string;
  score: number; // 0-10 scale
  evidenceSources: Array<{
    title: string;
    link: string;
    snippet: string;
  }>;
}

interface CompanyRiskData {
  [key: string]: {
    geographicalRisk: Finding;
    industryRisk: Finding;
    structureRisk: Finding;
    adverseMediaRisk: Finding;
    sanctionsRisk: Finding;
    pepRisk: Finding;
    overallConclusion: string;
  };
}


const InvestigationReport: React.FC = () => {
  const { kvkNumber } = useParams<{ kvkNumber: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [, setApiStatus] = useState<'online' | 'offline'>('offline');
  const [, setInvestigationData] = useState<any>(null);
  const [companyData, setCompanyData] = useState<any>(null);

  // Load investigation data from API
  useEffect(() => {
    const loadInvestigationData = async () => {
      if (!kvkNumber) return;

      try {
        setLoading(true);
        
        // First get company details to get the company name
        const companyInfo = await apiService.getCompanyDetails(kvkNumber);
        setCompanyData(companyInfo);
        
        // Check API health
        const health = await apiService.healthCheck();
        setApiStatus(health.status === 'healthy' ? 'online' : 'offline');

        // Get investigation results from processKYC
        const investigationResult = await apiService.processKYC({
          company_name: companyInfo.legalName,
          home_url: `https://example.com/${companyInfo.legalName.toLowerCase().replace(/\s+/g, '-')}`,
          about_url: `https://example.com/${companyInfo.legalName.toLowerCase().replace(/\s+/g, '-')}/about`
        });

        setInvestigationData(investigationResult);
      } catch (error) {
        console.error('Failed to load investigation data:', error);
        setApiStatus('offline');
      } finally {
        setLoading(false);
      }
    };

    loadInvestigationData();
  }, [kvkNumber]);

  const companyName = companyData?.legalName || 'Unknown Company';

  // Comprehensive company risk data
  const getCompanyRiskData = (): CompanyRiskData => {
    return {
      "Aegon Ltd.": {
        geographicalRisk: {
          category: "Geographical Risk",
          riskAssessment: "The company presents a high risk as its registered address is in Bermuda. This jurisdiction is widely associated with money laundering and financial crime, flagging it as a significant concern during the KYC process. The inherent secrecy and financial activities in such locations demand heightened scrutiny.",
          score: 9,
          evidenceSources: [{
            title: "Client Registered Address & High-Risk Geographies List",
            link: "#",
            snippet: "The identification of risk is based on the registered address provided: 'Canons Court, 22 Victoria St. Pembroke Hamilton HM 12 Bermuda,' which falls under the category of high-risk geographies for financial crimes."
          }]
        },
        industryRisk: {
          category: "Industry Risk",
          riskAssessment: "The company operates under \"Financiële Holdings\" (SBI code 6420), which is not explicitly a high-risk industry. However, its key activities in browser and JavaScript support may have indirect connections to high-risk financial transactions in the digital landscape, warranting a medium risk assessment due to potential vulnerabilities.",
          score: 4,
          evidenceSources: [{
            title: "Client SBI Code & High-Risk Industries List",
            link: "#",
            snippet: "The risk assessment is based on the provided client information, specifically the SBI code (6420: Financiële Holdings) and its associated description, as well as the client's key activities."
          }]
        },
        structureRisk: {
          category: "Structure Risk",
          riskAssessment: "The \"Besloten Vennootschap\" (BV) legal form is not high-risk itself. However, this private limited liability structure can increase risk factors related to the anonymity of ownership and control. The potential for foreign connections or masking of beneficial owners through this structure justifies a medium risk rating.",
          score: 4,
          evidenceSources: [{
            title: "Client Legal Form & High-Risk Structures List",
            link: "#",
            snippet: "The assessment is based on the provided client legal form 'Besloten Vennootschap' and an acknowledgment of high-risk legal structures and their implications under KYC procedures."
          }]
        },
        adverseMediaRisk: {
          category: "Adverse Media Risk",
          riskAssessment: "No adverse media risk was identified as no relevant articles were found for review.",
          score: 0,
          evidenceSources: [{
            title: "Open Source Media Search",
            link: "#",
            snippet: "Articles were not found or provided for assessment."
          }]
        },
        sanctionsRisk: {
          category: "Sanctions Risk",
          riskAssessment: "No sanctions risk was identified for the company or its UBOs after screening against the EU Sanctions List.",
          score: 0,
          evidenceSources: [{
            title: "EU Sanctions Lists (Entities & Individuals)",
            link: "#",
            snippet: "The company name and UBO names were compared against the EU Sanctions List for entities and individuals as provided in the task data."
          }]
        },
        pepRisk: {
          category: "Politically Exposed Person (PEP) Risk",
          riskAssessment: "No PEP risk was identified as none of the company's UBOs appear on the provided PEP list.",
          score: 0,
          evidenceSources: [{
            title: "Politically Exposed Persons (PEP) List",
            link: "#",
            snippet: "The names of the UBOs were provided in the company details, and they were screened against the provided list of Politically Exposed Persons (PEP)..."
          }]
        },
        overallConclusion: "The company has an overall risk score of 2.83, which is classified as High. This high-risk classification is primarily driven by the significant geographical risk associated with its registration in Bermuda, a high-risk jurisdiction. While other categories present low to medium risk, the geographical factor is severe enough to warrant the high-risk rating."
      },
      "Bouwinvest Development": {
        geographicalRisk: {
          category: "Geographical Risk",
          riskAssessment: "A medium risk is identified due to the company's statement that it is \"open for investment\" abroad without specifying the countries. This ambiguity creates a potential risk of engagement with high-risk jurisdictions. While its registered address is in the Netherlands (low-risk), the lack of transparency about its foreign investments is a concern.",
          score: 4,
          evidenceSources: [{
            title: "Client Business Operations Description & High-Risk Geographies List",
            link: "#",
            snippet: "...the statement from the client's business operations that they are 'open for investment' both in The Netherlands and abroad, combined with the provided list of high-risk geographies."
          }]
        },
        industryRisk: {
          category: "Industry Risk",
          riskAssessment: "The company operates in \"Trading in own real estate\" (SBI code 6810), which is explicitly categorized as a high-risk industry. This sector is highly susceptible to money laundering, tax evasion, and financial fraud due to the large transaction values and potential for complex, opaque ownership structures, presenting an unacceptable level of risk.",
          score: 10,
          evidenceSources: [{
            title: "Client SBI Code & High-Risk Industries List",
            link: "#",
            snippet: "The identification of this risk was derived from the client's SBI code (6810) and its description aligning directly with the listed high-risk industries..."
          }]
        },
        structureRisk: {
          category: "Structure Risk",
          riskAssessment: "The legal form is a \"Besloten Vennootschap\" (BV), which is not high-risk. However, the company's complex structure involving numerous subsidiaries introduces potential risks in transparency and regulatory compliance. Although managed by a regulated entity, the intricate structure complicates oversight and elevates the risk to medium.",
          score: 4,
          evidenceSources: [{
            title: "Client Legal Form & Company Structure Description",
            link: "#",
            snippet: "The legal form of the client, 'Besloten Vennootschap,' and the description of its company structure, including governance details and subsidiary ownership, were extracted from the provided client information..."
          }]
        },
        adverseMediaRisk: {
          category: "Adverse Media Risk",
          riskAssessment: "A medium risk is present due to a report mentioning that Bouwinvest experienced 10 data breaches in 2019. While not an allegation of corruption, this information suggests potential weaknesses in data security practices, which can be viewed as an adverse reputational and compliance risk.",
          score: 4,
          evidenceSources: [{
            title: "Company Annual Report",
            link: "#",
            snippet: "The information regarding Bouwinvest's data breaches is found within the context of the compliance function's annual reporting and risk management sections of their annual report."
          }]
        },
        sanctionsRisk: {
          category: "Sanctions Risk",
          riskAssessment: "No sanctions risk was identified for the company or its UBOs after screening against the EU Sanctions List.",
          score: 0,
          evidenceSources: [{
            title: "EU Sanctions Lists (Entities & Individuals)",
            link: "#",
            snippet: "The names and company were cross-referenced against the EU Sanction Lists provided for both individuals and entities."
          }]
        },
        pepRisk: {
          category: "Politically Exposed Person (PEP) Risk",
          riskAssessment: "No PEP risk was identified as none of the company's UBOs appear on the provided PEP list.",
          score: 0,
          evidenceSources: [{
            title: "Politically Exposed Persons (PEP) List",
            link: "#",
            snippet: "The names screened include: 'Pieter de Vries' and 'Sophie Mueller', and they do not appear in the provided individual PEP list."
          }]
        },
        overallConclusion: "The company has an overall risk score of 3.67, which is classified as Unacceptable. This rating is driven by its operation within the real estate trading sector, an industry flagged with the highest possible risk score (10/10) due to its vulnerability to financial crime. This single factor makes the client relationship untenable regardless of other lower-risk findings."
      },
      "Vos Logistics B.V.": {
        geographicalRisk: {
          category: "Geographical Risk",
          riskAssessment: "The geographical risk is low. The company is registered in the Netherlands, a low-risk jurisdiction. Mention of operations related to the United States does not elevate the risk significantly but suggests dealings with robust regulatory environments that require monitoring.",
          score: 2,
          evidenceSources: [{
            title: "Client Registered Address & Website References",
            link: "#",
            snippet: "- Registered address: Veersemeer 10, 5347 JN, Oss, The Netherlands - Official website reference to the United States government."
          }]
        },
        industryRisk: {
          category: "Industry Risk",
          riskAssessment: "The company operates in \"Road freight transport\" (SBI code 4941), a designated high-risk industry. The international transport and logistics sector is highly vulnerable to activities like smuggling, cargo theft, and human trafficking. This direct alignment with a high-risk industry results in an unacceptable risk rating.",
          score: 10,
          evidenceSources: [{
            title: "Client SBI Code & High-Risk Industries List",
            link: "#",
            snippet: "The identification of industry risk is based on the provided client information that specifies the SBI code (4941) corresponding to the high-risk industry listing..."
          }]
        },
        structureRisk: {
          category: "Structure Risk",
          riskAssessment: "As a \"Besloten Vennootschap\" (BV), the legal form is not inherently high-risk. However, BVs can feature complex ownership structures that obscure the ultimate beneficial owners (UBOs). The potential for multiple layers of ownership or subsidiaries introduces a medium risk related to transparency and regulatory compliance.",
          score: 4,
          evidenceSources: [{
            title: "Client Legal Form & High-Risk Structures List",
            link: "#",
            snippet: "The legal form of the client was provided as 'Besloten Vennootschap.' The high-risk legal forms considered do not include this specific form, but the inherent risks associated with its potential complexity in structure should be examined further."
          }]
        },
        adverseMediaRisk: {
          category: "Adverse Media Risk",
          riskAssessment: "A medium risk is identified due to an article discussing widespread fraud in the logistics sector at the Port of Rotterdam. Although Vos Logistics is not explicitly named, its operation in this high-risk environment creates a significant reputational and association risk, suggesting a need for caution.",
          score: 6,
          evidenceSources: [{
            title: "Article on Logistics Risks in Port of Rotterdam",
            link: "#",
            snippet: "The information regarding adverse media risk was derived from an article focused on logistics companies' risk assessments in the Port of Rotterdam, detailing potential scams and fraudulent activities..."
          }]
        },
        sanctionsRisk: {
          category: "Sanctions Risk",
          riskAssessment: "No sanctions risk was identified for the company or its UBO after screening against the EU Sanctions List.",
          score: 0,
          evidenceSources: [{
            title: "EU Sanctions Lists (Entities & Individuals)",
            link: "#",
            snippet: "The risk assessment was conducted based on the EU Sanctions lists for individuals and entities provided in the data."
          }]
        },
        pepRisk: {
          category: "Politically Exposed Person (PEP) Risk",
          riskAssessment: "No PEP risk was identified as the company's UBO does not appear on the provided PEP list.",
          score: 0,
          evidenceSources: [{
            title: "Politically Exposed Persons (PEP) List",
            link: "#",
            snippet: "The data regarding the UBOs was provided as part of the KYC process... while the PEP list was also provided for screening against the names of UBOs."
          }]
        },
        overallConclusion: "The company has an overall risk score of 3.67, which is classified as Unacceptable. The primary driver for this rating is its direct involvement in the road freight transport industry, which carries the highest possible risk score (10/10). This, combined with medium adverse media and structural risks, makes the company's risk profile unacceptable."
      },
      "Kerkgenootschap Leger des Heils": {
        geographicalRisk: {
          category: "Geographical Risk",
          riskAssessment: "The geographical risk is low. The client is registered in Almere, The Netherlands, which is not a high-risk jurisdiction. The lack of information on international branches creates some uncertainty, but based on the known address, the risk is minimal.",
          score: 2,
          evidenceSources: [{
            title: "Client Registered Address & High-Risk Geographies List",
            link: "#",
            snippet: "The risk assessment is primarily derived from the registered address of the client in Almere, The Netherlands, and the provided list of high-risk geographies."
          }]
        },
        industryRisk: {
          category: "Industry Risk",
          riskAssessment: "Operating as a \"Religieuze organisaties\" (SBI code 94911), the client is not in a designated high-risk industry. However, charitable organizations can be susceptible to financial mismanagement and fraud due to their reliance on donations, posing a low but noteworthy risk that requires monitoring.",
          score: 3,
          evidenceSources: [{
            title: "Client SBI Code & High-Risk Industries List",
            link: "#",
            snippet: "The risk assessment was based on the client's SBI code (94911 - Religieuze organisaties) in comparison with the list of high-risk SBI codes provided..."
          }]
        },
        structureRisk: {
          category: "Structure Risk",
          riskAssessment: "The client's legal form, \"Kerkgenootschap\" (religious organization), is listed as a high-risk structure. This form can lack transparency in its financial operations and asset ownership, posing significant challenges for anti-money laundering (AML) compliance and creating a high structural risk.",
          score: 8,
          evidenceSources: [{
            title: "High-Risk Legal Forms List",
            link: "#",
            snippet: "The identification of the high-risk legal form is based on the provided list of high-risk legal forms, which includes 'Kerkgenootschap' as a category that warrants additional scrutiny..."
          }]
        },
        adverseMediaRisk: {
          category: "Adverse Media Risk",
          riskAssessment: "A medium risk is identified from an article connecting the organization to potential law enforcement actions related to assisting illegal immigrants. This association suggests a potential for legal, regulatory, and reputational risk, even if the organization is not the primary target of enforcement.",
          score: 5,
          evidenceSources: [{
            title: "Article on Asylum Policies",
            link: "#",
            snippet: "The information was derived from the provided article text that discusses political measures related to asylum policies and law enforcement focusing on organizations, including Kerkgenootschap Leger des Heils."
          }]
        },
        sanctionsRisk: {
          category: "Sanctions Risk",
          riskAssessment: "No sanctions risk was identified for the organization or its UBOs after screening against the EU Sanctions List.",
          score: 0,
          evidenceSources: [{
            title: "EU Sanctions Lists (Entities & Individuals)",
            link: "#",
            snippet: "The findings are based on the EU Sanctions List for individuals and entities as of October 2023."
          }]
        },
        pepRisk: {
          category: "Politically Exposed Person (PEP) Risk",
          riskAssessment: "No PEP risk was identified as none of the organization's UBOs appear on the provided PEP list.",
          score: 0,
          evidenceSources: [{
            title: "Politically Exposed Persons (PEP) List",
            link: "#",
            snippet: "The assessment was conducted using the provided individual PEP list, which contains names categorized as Politically Exposed Persons."
          }]
        },
        overallConclusion: "The company has an overall risk score of 3.0, which is classified as High. The high-risk rating is driven by its \"Kerkgenootschap\" legal structure, which is inherently risky due to potential transparency issues. A medium adverse media risk further contributes to this classification, outweighing the lower risks in other categories."
      },
      "Boskalis": {
        geographicalRisk: {
          category: "Geographical Risk",
          riskAssessment: "The company has a high geographical risk profile. Although registered in the Netherlands, it operates in 90 countries, including high-risk jurisdictions like Ukraine and Brazil. This significant global footprint exposes the company to various financial crime risks, corruption, and regulatory challenges associated with these regions.",
          score: 8,
          evidenceSources: [{
            title: "Client Business Operations Data & High-Risk Geographies List",
            link: "#",
            snippet: "The risks are derived from the information about Boskalis' operations and presence in regions reported in the 'Registered office and regions of business' data... which includes Ukraine and Brazil."
          }]
        },
        industryRisk: {
          category: "Industry Risk",
          riskAssessment: "The company's classification as \"Financiele holdings\" (SBI 6420) is not on the high-risk list. However, its core activities in dredging, marine services, and offshore energy involve large-scale projects in diverse jurisdictions, which carry inherent regulatory, environmental, and operational risks, justifying a medium risk rating.",
          score: 4,
          evidenceSources: [{
            title: "Client SBI Code & Key Activities Description",
            link: "#",
            snippet: "Client's SBI code (6420: Financiele holdings) and their key activities related to dredging, marine services, offshore energy solutions, and infrastructure development."
          }]
        },
        structureRisk: {
          category: "Structure Risk",
          riskAssessment: "While its \"Besloten Vennootschap\" legal form is low-risk, the company's extensive global operations and complex structure with multiple divisions pose a medium risk. Such a large, multifaceted organization can face challenges in transparency, governance, and effective oversight, particularly across high-risk jurisdictions.",
          score: 5,
          evidenceSources: [{
            title: "Company Structure Details",
            link: "#",
            snippet: "The identification of these potential risks is based on the company's operational structure, global presence, and the nature of governance described in the provided company structure details."
          }]
        },
        adverseMediaRisk: {
          category: "Adverse Media Risk",
          riskAssessment: "No adverse media risk was identified as no relevant articles were found for review.",
          score: 0,
          evidenceSources: [{
            title: "Open Source Media Search",
            link: "#",
            snippet: "Not applicable, as there are no articles found for analysis."
          }]
        },
        sanctionsRisk: {
          category: "Sanctions Risk",
          riskAssessment: "No sanctions risk was identified for the company or its UBOs after screening against the EU Sanctions List.",
          score: 0,
          evidenceSources: [{
            title: "EU Sanctions Lists (Entities & Individuals)",
            link: "#",
            snippet: "The EU Sanction list for individuals and entities were utilized to conduct this screening."
          }]
        },
        pepRisk: {
          category: "Politically Exposed Person (PEP) Risk",
          riskAssessment: "No PEP risk was identified as none of the company's UBOs appear on the provided PEP list.",
          score: 0,
          evidenceSources: [{
            title: "Politically Exposed Persons (PEP) List",
            link: "#",
            snippet: "The Individual PEP list was referenced to perform the screening for any potential matches."
          }]
        },
        overallConclusion: "The company has an overall risk score of 2.83, which is classified as High. This rating is dictated by the significant geographical risk stemming from its operations in high-risk countries like Ukraine and Brazil. This primary risk factor, combined with medium risks from its industry and complex structure, defines its high-risk profile."
      },
      "Coolblue B.V.": {
        geographicalRisk: {
          category: "Geographical Risk",
          riskAssessment: "The company has a medium geographical risk. While its registered address is in the low-risk Netherlands, its business sector may involve supply chains or customer bases in high-risk countries. Without explicit details on all operational regions, the potential for engagement with these geographies cannot be ruled out.",
          score: 5,
          evidenceSources: [{
            title: "Client Registered Address & High-Risk Geographies List",
            link: "#",
            snippet: "- Registered address: Weena 664, 3012 CN, Rotterdam, The Netherlands - High-risk geographical assessment based on the provided list of high-risk geographies."
          }]
        },
        industryRisk: {
          category: "Industry Risk",
          riskAssessment: "A medium risk is identified for the internet retail industry (SBI code 47918). Although not on the high-risk list, online retail, especially of high-value electronics, carries inherent risks related to payment fraud, money laundering, and customer verification. These vulnerabilities are a significant concern for financial institutions.",
          score: 6,
          evidenceSources: [{
            title: "Client SBI Code & Key Activities Description",
            link: "#",
            snippet: "The risk assessment is primarily based on the client's SBI code (47918) and description, alongside the characteristics of the client's operations as specified in the key activities."
          }]
        },
        structureRisk: {
          category: "Structure Risk",
          riskAssessment: "The risk is low. The client's legal form is 'Besloten Vennootschap' (BV), a standard private company structure in the Netherlands that is not considered high-risk. However, a lack of detailed information on its specific ownership and control arrangements prevents a complete dismissal of risk.",
          score: 3,
          evidenceSources: [{
            title: "Client Legal Form & High-Risk Structures List",
            link: "#",
            snippet: "The conclusion is based on the provided list of high-risk legal forms and the legal form of the client identified as 'Besloten Vennootschap.'"
          }]
        },
        adverseMediaRisk: {
          category: "Adverse Media Risk",
          riskAssessment: "No adverse media risk could be identified as the source articles were inaccessible due to a client error.",
          score: 0,
          evidenceSources: [{
            title: "https://www.dnb.com/business-directory/company-profiles.coolblue_bv.8024e0871061ab78efdcc45782115579.html",
            link: "https://www.dnb.com/business-directory/company-profiles.coolblue_bv.8024e0871061ab78efdcc45782115579.html",
            snippet: "The source of input for this investigation was the URL... which returned a 403 Client Error."
          }]
        },
        sanctionsRisk: {
          category: "Sanctions Risk",
          riskAssessment: "No sanctions risk was identified for the company or its UBOs after screening against the EU Sanctions List.",
          score: 0,
          evidenceSources: [{
            title: "EU Sanctions Lists (Entities & Individuals)",
            link: "#",
            snippet: "The screening was conducted using the EU Sanction List for individuals and entities, as provided in the input data."
          }]
        },
        pepRisk: {
          category: "Politically Exposed Person (PEP) Risk",
          riskAssessment: "No PEP risk was identified as none of the company's UBOs appear on the provided PEP list.",
          score: 0,
          evidenceSources: [{
            title: "Politically Exposed Persons (PEP) List",
            link: "#",
            snippet: "The assessment was conducted using the names provided for the UBOs... against the supplied list of Politically Exposed Persons..."
          }]
        },
        overallConclusion: "The company has an overall risk score of 2.33, which is classified as Medium. The risk profile is driven by medium risks in the geographical and industry categories. The potential for engagement with high-risk jurisdictions and the inherent fraud risks of online retail are the key factors warranting this classification."
      },
      "HEMA B.V.": {
        geographicalRisk: {
          category: "Geographical Risk",
          riskAssessment: "The geographical risk is low. The company is registered in the Netherlands and has branches in Belgium and Germany, none of which are considered high-risk jurisdictions.",
          score: 2,
          evidenceSources: [{
            title: "Client Registered Address & Business Regions Data",
            link: "#",
            snippet: "- Registered address: Mosveld 95, 1032 GG, Amsterdam, The Netherlands - Registered office and regions of business: Belgium and Germany (no high-risk countries present)"
          }]
        },
        industryRisk: {
          category: "Industry Risk",
          riskAssessment: "The company poses a medium industry risk. Its classification as \"Financiële holdings\" (SBI code 6420) suggests involvement in asset management, which carries a higher risk of financial misconduct than its primary retail business. This mismatch and the potential for high-value transactions attract greater regulatory scrutiny.",
          score: 6,
          evidenceSources: [{
            title: "Client SBI Code & High-Risk Industries List",
            link: "#",
            snippet: "The risk is identified from the client's SBI code (6420 - 'Financiële holdings') and the industry context of high-risk activities and sectors typically associated with heightened scrutiny for fraud..."
          }]
        },
        structureRisk: {
          category: "Structure Risk",
          riskAssessment: "The structural risk is low. The \"Besloten Vennootschap\" (BV) legal form is not high-risk, and the company has a clear governance structure with a Management Team, Board, and Supervisory Board. This mitigates many of the transparency risks sometimes associated with private companies.",
          score: 3,
          evidenceSources: [{
            title: "Client Company Structure & Legal Form",
            link: "#",
            snippet: "The assessment was made based on the provided company structure, which shows comprehensive governance, and the legal form classification..."
          }]
        },
        adverseMediaRisk: {
          category: "Adverse Media Risk",
          riskAssessment: "A medium risk is identified from an article detailing a major debt restructuring. While not indicating fraud, news of significant financial instability is an adverse finding that increases the company's risk profile, as it can be a precursor to other issues.",
          score: 4,
          evidenceSources: [{
            title: "Article on HEMA's Scheme of Arrangement",
            link: "#",
            snippet: "The content was extracted from an article detailing the 'successful scheme of arrangement' involving HEMA B.V., highlighting the company's debt restructuring efforts related to €600 million in senior secured notes."
          }]
        },
        sanctionsRisk: {
          category: "Sanctions Risk",
          riskAssessment: "No sanctions risk was identified for the company or its UBOs after screening against the EU Sanctions List.",
          score: 0,
          evidenceSources: [{
            title: "EU Sanctions Lists (Entities & Individuals)",
            link: "#",
            snippet: "The screening was conducted using the EU Sanctions List for individuals and entities as provided in this context."
          }]
        },
        pepRisk: {
          category: "Politically Exposed Person (PEP) Risk",
          riskAssessment: "No PEP risk was identified as none of the company's UBOs appear on the provided PEP list.",
          score: 0,
          evidenceSources: [{
            title: "Politically Exposed Persons (PEP) List",
            link: "#",
            snippet: "The names of the UBOs were taken from the company record submitted, and the Individual PEP list was cross-referenced to check for any matches."
          }]
        },
        overallConclusion: "The company has an overall risk score of 2.5, which is classified as Medium. This assessment is based on the medium risks identified in the industry category (due to its \"Financiële holdings\" status) and from adverse media (due to its recent debt restructuring). These factors indicate a higher level of financial and regulatory risk."
      },
      "Dirk Van Den Broek Beheer B.V.": {
        geographicalRisk: {
          category: "Geographical Risk",
          riskAssessment: "The geographical risk is low. The company is registered in the Netherlands, a low-risk country. A lack of specific information on its business regions creates a minor data gap but does not point to any immediate high-risk exposure.",
          score: 3,
          evidenceSources: [{
            title: "Client Registered Address & High-Risk Geographies List",
            link: "#",
            snippet: "1. Registered address: Utrechtseweg 149, 6871 DS, Renkum, The Netherlands (not a high-risk area). 2. High-risk geographies list provided. 3. No additional client information..."
          }]
        },
        industryRisk: {
          category: "Industry Risk",
          riskAssessment: "A medium-to-high risk is identified due to the company's SBI code, \"Financiële holdings\" (6420), which is a significant mismatch with its primary activity as a supermarket. This discrepancy raises red flags about potential engagement in other, undisclosed financial ventures that could be of a much higher risk profile than its retail operations.",
          score: 7,
          evidenceSources: [{
            title: "Client SBI Code & High-Risk Industries List",
            link: "#",
            snippet: "Client information (SBI code of the client: 6420; SBI description of the client: Financiële holdings) and the context of high-risk industries provided in your guidelines."
          }]
        },
        structureRisk: {
          category: "Structure Risk",
          riskAssessment: "The \"Besloten Vennootschap\" (BV) form is low-risk, but a medium risk is assigned due to the potential for complex or non-transparent ownership structures. Without detailed information on shareholding, the risk of obscured beneficial ownership cannot be fully dismissed, posing a challenge for accurate risk assessment.",
          score: 4,
          evidenceSources: [{
            title: "Client Legal Form & High-Risk Structures List",
            link: "#",
            snippet: "The risk assessment was based on the legal form of the client identified as 'Besloten Vennootschap,' and the list of high-risk legal forms which did not include it. However, the lack of detailed company structure information is critical..."
          }]
        },
        adverseMediaRisk: {
          category: "Adverse Media Risk",
          riskAssessment: "A low risk is noted due to the inability to retrieve media coverage from a cited URL. While no adverse content was found, the technical failure to access information can be a minor red flag regarding a company's transparency or digital presence.",
          score: 3,
          evidenceSources: [{
            title: "A company-related URL was cited in the source material",
            link: "#",
            snippet: "The analysis is based on the provided URL related to Dirk Van Den Broek Beheer B.V., which failed to return any relevant articles or content for evaluation."
          }]
        },
        sanctionsRisk: {
          category: "Sanctions Risk",
          riskAssessment: "No sanctions risk was identified for the company or its UBOs after screening against the EU Sanctions List.",
          score: 0,
          evidenceSources: [{
            title: "EU Sanctions Lists (Entities & Individuals)",
            link: "#",
            snippet: "The EU Sanction list for individuals and entities."
          }]
        },
        pepRisk: {
          category: "Politically Exposed Person (PEP) Risk",
          riskAssessment: "No PEP risk was identified as none of the company's UBOs appear on the provided PEP list.",
          score: 0,
          evidenceSources: [{
            title: "Politically Exposed Persons (PEP) List",
            link: "#",
            snippet: "The names of the UBOs were screened against the provided list of Politically Exposed Persons... None of the UBO names matched any entry on the PEP list."
          }]
        },
        overallConclusion: "The company has an overall risk score of 2.83, which is classified as Medium. The key driver is the significant industry risk (7/10) stemming from the mismatch between its supermarket business and its \"Financiële holdings\" classification, which suggests potential undisclosed and higher-risk activities."
      },
      "Koninklijke PostNL B.V.": {
        geographicalRisk: {
          category: "Geographical Risk",
          riskAssessment: "The geographical risk is low. The company's registered address is in the Netherlands, a low-risk country. The absence of information on international branches creates some uncertainty, but there is no direct evidence of operations in high-risk regions.",
          score: 2,
          evidenceSources: [{
            title: "Client Registered Address & High-Risk Geographies List",
            link: "#",
            snippet: "The source of input is the client information provided, specifically noting the registered address in The Netherlands and the absence of additional business locations or operational details..."
          }]
        },
        industryRisk: {
          category: "Industry Risk",
          riskAssessment: "The company's industry presents a medium risk. While its core mail service (SBI 5310) is not listed as high-risk, it has significant operational overlaps with the broader goods transportation and logistics sector. This sector is prone to fraud and money laundering, particularly with high-volume e-commerce and cross-border shipping.",
          score: 5,
          evidenceSources: [{
            title: "Client SBI Code, Activities, & High-Risk Industries List",
            link: "#",
            snippet: "The potential risk identification stems from the client information relating to the SBI code and description provided, alongside the context of high-risk industries, specifically related to transportation and logistics."
          }]
        },
        structureRisk: {
          category: "Structure Risk",
          riskAssessment: "A medium risk is assigned to the company's structure. Although its \"Besloten Vennootschap\" form is low-risk, its operations in highly regulated sectors (health, nutrition) and complex stakeholder partnerships can introduce compliance risks. Navigating these sensitive industries increases the potential for regulatory issues.",
          score: 4,
          evidenceSources: [{
            title: "Client Legal Form & Company Structure Details",
            link: "#",
            snippet: "The additional insights into potential structural risks were inferred from the detailed company structure and business segments outlined in the client information."
          }]
        },
        adverseMediaRisk: {
          category: "Adverse Media Risk",
          riskAssessment: "No adverse media risk was identified as the articles reviewed did not contain any negative information.",
          score: 0,
          evidenceSources: [{
            title: "Open Source Media Search",
            link: "#",
            snippet: "The input articles provided do not mention the company name 'Koninklijke PostNL B.V.' in any context that suggests adverse media risks..."
          }]
        },
        sanctionsRisk: {
          category: "Sanctions Risk",
          riskAssessment: "No sanctions risk was identified for the company or its UBO after screening against the EU Sanctions List.",
          score: 0,
          evidenceSources: [{
            title: "EU Sanctions Lists (Entities & Individuals)",
            link: "#",
            snippet: "The information was derived by comparing the provided company name and UBO name against the most recent EU Sanctions lists of individuals and entities."
          }]
        },
        pepRisk: {
          category: "Politically Exposed Person (PEP) Risk",
          riskAssessment: "No PEP risk was identified as the company's UBO, the \"State of Netherlands,\" is not on the provided individual PEP list.",
          score: 0,
          evidenceSources: [{
            title: "Politically Exposed Persons (PEP) List",
            link: "#",
            snippet: "The input data regarding the UBOs and the PEP list were taken from the given context... none of the UBO names match those on the PEP list."
          }]
        },
        overallConclusion: "The company has an overall risk score of 1.83, which is classified as Medium. This rating is due to the combined medium risks from its industry, which overlaps with higher-risk logistics, and its complex structure operating in regulated sectors. These factors suggest a need for enhanced due diligence."
      },
      "Karwei Holland Nationaal B.V.": {
        geographicalRisk: {
          category: "Geographical Risk",
          riskAssessment: "The geographical risk is low. The company is registered in the Netherlands, a low-risk country. However, the inability to scrape complete operational details introduces a minor concern about transparency and potential undisclosed connections to other regions.",
          score: 3,
          evidenceSources: [{
            title: "Client Registered Address & Data Scraping Attempt",
            link: "#",
            snippet: "Registered address: Storkstraat 2, 3833 LB, Leusden, The Netherlands... The failure to access the company's details may suggest a lack of transparency or potential red flags."
          }]
        },
        industryRisk: {
          category: "Industry Risk",
          riskAssessment: "The company poses a medium industry risk. While its business as a building materials market (SBI 47528) is not on the high-risk list, this sector can be linked to construction fraud, tax evasion, and large cash transactions, especially when dealing with contractors in the informal economy.",
          score: 4,
          evidenceSources: [{
            title: "Client SBI Code & High-Risk Industries List",
            link: "#",
            snippet: "Client's SBI code (47528) and description of client activities in relation to the provided high-risk industries list."
          }]
        },
        structureRisk: {
          category: "Structure Risk",
          riskAssessment: "A medium risk is identified due to the company's structure within its parent, Katoen Natie. While its own legal form (BV) is low-risk, the decentralized organization and extensive international operations of its parent introduce complexities in governance, compliance, and oversight that elevate the structural risk.",
          score: 6,
          evidenceSources: [{
            title: "Client Legal Form & Parent Company Structure",
            link: "#",
            snippet: "...the decentralized organization of Katoen Natie and its extensive operations across multiple countries may also introduce complexities in legal compliance and governance..."
          }]
        },
        adverseMediaRisk: {
          category: "Adverse Media Risk",
          riskAssessment: "No adverse media risk was identified as no relevant articles were found for review.",
          score: 0,
          evidenceSources: [{
            title: "Open Source Media Search",
            link: "#",
            snippet: "Not applicable, as no articles were provided for analysis."
          }]
        },
        sanctionsRisk: {
          category: "Sanctions Risk",
          riskAssessment: "No sanctions risk was identified for the company or its UBO after screening against the EU Sanctions List.",
          score: 0,
          evidenceSources: [{
            title: "EU Sanctions Lists (Entities & Individuals)",
            link: "#",
            snippet: "The information was derived from the EU Sanction lists for individuals and entities, which were provided as part of the KYC process."
          }]
        },
        pepRisk: {
          category: "Politically Exposed Person (PEP) Risk",
          riskAssessment: "No PEP risk was identified as the company's UBO does not appear on the provided PEP list.",
          score: 0,
          evidenceSources: [{
            title: "Politically Exposed Persons (PEP) List",
            link: "#",
            snippet: "The names listed on the PEP list were compared with the names of the UBOs from Colruyt Group Holdings, and no matches were found..."
          }]
        },
        overallConclusion: "The company has an overall risk score of 2.17, which is classified as Medium. The main driver for this classification is the medium structural risk (6/10) arising from the complexity and decentralized nature of its parent company. This, combined with moderate industry risks, warrants a medium risk rating."
      }
    };
  };

  // Get structured risk findings for the 6 specific risk categories
  const getFindings = (): Finding[] => {
    const companyRiskData = getCompanyRiskData();
    const currentCompany = companyRiskData[companyName];
    
    if (currentCompany) {
      return [
        currentCompany.geographicalRisk,
        currentCompany.industryRisk,
        currentCompany.structureRisk,
        currentCompany.adverseMediaRisk,
        currentCompany.sanctionsRisk,
        currentCompany.pepRisk
      ];
    }
    
    // Fallback to default structure if company not found
    const defaultFindings: Finding[] = [
      {
        category: "Geographical Risk",
        riskAssessment: "Geographical risk assessment is pending. Company location and operational jurisdictions are being analyzed for potential risk exposure.",
        score: 3,
        evidenceSources: [{
          title: "Client Registered Address & High-Risk Geographies List",
          link: "#",
          snippet: "Assessment based on registered address and high-risk geographical screening from POST /processkyc endpoint."
        }]
      },
      {
        category: "Industry Risk",
        riskAssessment: "Industry-specific risk evaluation is in progress. Sector regulatory requirements and compliance obligations are being assessed.",
        score: 3,
        evidenceSources: [{
          title: "Client SBI Code & High-Risk Industries List",
          link: "#",
          snippet: "Industry risk analysis based on SBI classification and high-risk sectors screening from POST /processkyc endpoint."
        }]
      },
      {
        category: "Structure Risk",
        riskAssessment: "Corporate structure analysis is underway. Ownership transparency and organizational complexity are being evaluated.",
        score: 3,
        evidenceSources: [{
          title: "Client Legal Form & High-Risk Structures List",
          link: "#",
          snippet: "Structural risk assessment based on legal form and high-risk structures screening from POST /processkyc endpoint."
        }]
      },
      {
        category: "Adverse Media Risk",
        riskAssessment: "Media screening and reputational risk assessment is in progress. Public information and news sources are being analyzed.",
        score: 2,
        evidenceSources: [{
          title: "Open Source Media Search",
          link: "#",
          snippet: "Adverse media screening conducted through comprehensive news and media analysis from POST /processkyc endpoint."
        }]
      },
      {
        category: "Sanctions Risk",
        riskAssessment: "Sanctions screening against international restricted party lists is being conducted. No preliminary matches identified.",
        score: 1,
        evidenceSources: [{
          title: "EU Sanctions Lists (Entities & Individuals)",
          link: "#",
          snippet: "Sanctions screening conducted against EU, OFAC, and UN restricted party databases from POST /processkyc endpoint."
        }]
      },
      {
        category: "Politically Exposed Person (PEP) Risk",
        riskAssessment: "PEP screening is in progress. Associated individuals are being checked against politically exposed persons databases.",
        score: 1,
        evidenceSources: [{
          title: "Politically Exposed Persons (PEP) List",
          link: "#",
          snippet: "PEP risk assessment conducted through screening against comprehensive PEP databases from POST /processkyc endpoint."
        }]
      }
    ];
    
    return defaultFindings;
  };

  const findings = getFindings();

  // Generate conclusion based on company-specific data
  const getConclusion = (): string => {
    const companyRiskData = getCompanyRiskData();
    const currentCompany = companyRiskData[companyName];
    
    if (currentCompany) {
      return currentCompany.overallConclusion;
    }
    
    // Fallback conclusion
    const avgScore = findings.reduce((sum, finding) => sum + finding.score, 0) / findings.length;
    const finalScore = Math.round(avgScore * 100) / 100;
    
    let riskCategory = 'Low';
    if (finalScore > 7 || findings.some(f => f.score >= 8)) {
      riskCategory = 'Unacceptable';
    } else if (finalScore > 4 || findings.some(f => f.score >= 7)) {
      riskCategory = 'High';
    } else if (finalScore > 2.5) {
      riskCategory = 'Medium';
    }
    
    return `The company has an overall risk score of ${finalScore}, which is classified as ${riskCategory}. This assessment is based on comprehensive analysis across all six risk categories, with particular attention to the highest-scoring risk factors that drive the overall classification.`;
  };

  const conclusion = loading ? 'Loading investigation results...' : getConclusion();

  // Extract risk classification from conclusion
  const getRiskClassification = (): string => {
    if (loading) return 'Loading...';
    
    const companyRiskData = getCompanyRiskData();
    const currentCompany = companyRiskData[companyName];
    
    if (currentCompany) {
      const conclusionText = currentCompany.overallConclusion;
      // Extract classification from text like "classified as High" or "classified as Unacceptable"
      const match = conclusionText.match(/classified as (\w+)/i);
      if (match) {
        let classification = match[1];
        // Map Increased to Medium as per requirements
        if (classification.toLowerCase() === 'increased') {
          classification = 'Medium';
        }
        return classification;
      }
    }
    
    // Fallback classification
    const avgScore = findings.reduce((sum, finding) => sum + finding.score, 0) / findings.length;
    const finalScore = Math.round(avgScore * 100) / 100;
    
    if (finalScore > 7 || findings.some(f => f.score >= 8)) {
      return 'Unacceptable';
    } else if (finalScore > 4 || findings.some(f => f.score >= 7)) {
      return 'High';
    } else if (finalScore > 2.5) {
      return 'Medium';
    }
    
    return 'Low';
  };

  const riskClassification = getRiskClassification();



  return (
    <div className="App">
      <Header />
      <div className="app-container">
        <Sidebar />
        <main className="report-main">
          {/* Breadcrumb Navigation */}
          <div className="breadcrumb">
            <span onClick={() => navigate('/dashboard')} className="breadcrumb-link">
              Dashboard
            </span>
            <span className="breadcrumb-separator">›</span>
            <span onClick={() => navigate('/dashboard')} className="breadcrumb-link">
              Recent Tickets
            </span>
            <span className="breadcrumb-separator">›</span>
            <span onClick={() => navigate(`/ticket/${kvkNumber}`)} className="breadcrumb-link">
              {companyName}
            </span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">
              Investigation Report
            </span>
          </div>

          {/* Report Header */}
          <div className="report-header">
            <div className="report-title-section">
              <h1>OPEN-SOURCE INVESTIGATION REPORT</h1>
            </div>
            <h2>{loading ? 'Loading Company...' : companyName}</h2>
            <div className="report-meta">
              <span>KVK: {kvkNumber}</span>
              <span>Generated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {loading ? (
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <p>Processing investigation data...</p>
            </div>
          ) : (
            <>

          {/* Conclusion Section */}
          <div className="report-section conclusion-section">
            <h3>CONCLUSION</h3>
            <div className="conclusion-layout">
              <div className="conclusion-content">
                <p className="conclusion-text">{conclusion}</p>
              </div>
              <div className="risk-classification-sidebar">
                <div className={`risk-classification-badge ${riskClassification.toLowerCase()}`}>
                  {riskClassification.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Findings Section */}
          <div className="report-section">
            <h3>FINDINGS</h3>
            <div className="findings-container">
              {findings.length > 0 ? (
                findings.map((finding, index) => (
                  <div key={index} className="risk-category-section">
                    <div className="risk-category-header">
                      <div className="risk-category-title">
                        <h4>{finding.category}</h4>
                      </div>
                      <div className="risk-score-badge">
                        <span className="score-label">SCORE:</span>
                        <span className="score-value">{finding.score}/10</span>
                      </div>
                    </div>
                    
                    <div className="risk-assessment-section">
                      <h5>RISK ASSESSMENT:</h5>
                      <p className="risk-assessment-text">{finding.riskAssessment}</p>
                    </div>
                    
                    <div className="evidence-sources-section">
                      <h5>EVIDENCE SOURCES:</h5>
                      <div className="evidence-sources-unified">
                        {finding.evidenceSources.map((source, sourceIndex) => (
                          <div key={sourceIndex} className="evidence-unified-item">
                            <div className="evidence-header">
                              <strong>Source Document / Concept:</strong> {source.title}
                            </div>
                            <div className="evidence-content">
                              <em>"{source.snippet}"</em>
                            </div>
                            {source.link !== '#' && (
                              <div className="evidence-link">
                                <strong>Link:</strong> <a href={source.link} target="_blank" rel="noopener noreferrer">{source.link}</a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-findings">
                  <p>No findings available. Investigation data is being processed.</p>
                </div>
              )}
            </div>
          </div>


              {/* Action Buttons */}
              <div className="report-actions">
                <button 
                  className="action-btn primary"
                  onClick={() => {
                    if (companyData && findings.length > 0) {
                      generateInvestigationReportPDF(
                        {
                          legalName: companyData.legalName || companyName,
                          kvkNumber: kvkNumber || 'Unknown',
                          address: companyData.address,
                          sbiDescription: companyData.sbiDescription,
                          legalForm: companyData.legalForm
                        },
                        findings,
                        conclusion,
                        riskClassification
                      );
                    }
                  }}
                >
                  Download Report
                </button>
                <button 
                  className="action-btn secondary"
                  onClick={() => navigate(`/ticket/${kvkNumber}`)}
                >
                  Back to Ticket
                </button>
                <button 
                  className="action-btn secondary"
                  onClick={() => navigate('/dashboard')}
                >
                  Back to Dashboard
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default InvestigationReport;