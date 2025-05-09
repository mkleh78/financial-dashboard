import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
// Importiere die Logos

import rolandBergerLogo from '../assets/roland-berger-logo.png';
import hoftLogo from '../assets/hoft-logo.png';

// Main dashboard component
const FinanzkompassDashboard = () => {
  // State for the dashboard
  const [formData, setFormData] = useState({
    // Financial Basis
    einkommen: 3000,
    fixeKosten: 1200,
    variableKosten: 800,
    notgroschen: 4000,
    dispoKredite: 200,
    ratenKredite: 10000,
    
    // Risk Protection
    versicherungen: {
      krankenversicherung: true,
      berufsunfaehigkeit: false,
      privateHaftpflicht: true,
      risikoleben: false,
      unfall: false,
      hausrat: true,
      wohngebaeude: false,
      rechtsschutz: false,
      kfzHaftpflicht: true
    },
    
    // Emergency Folder
    notfallordner: {
      vorsorgevollmacht: false,
      patientenverfuegung: false,
      betreuungsverfuegung: false,
      bankUnterlagen: true,
      testament: false,
      kontaktliste: true
    },
    
    // Investment & Asset Base
    vermoegenAnlage: {
      aktienEtfs: true,
      aktienEtfsBetrag: 15000,
      immobilien: false,
      immobilienBetrag: 0,
      anleihen: false,
      anleihenBetrag: 0,
      versicherungen: false,
      versicherungenBetrag: 0,
      bankeinlagen: true,
      bankeinlagenBetrag: 5000
    },
    
    // Retirement Planning
    altersvorsorge: {
      gesetzlicheRente: 1000,
      betrieblicheRente: 200,
      privateRente: 300
    }
  });
  
  // Calculate all scores
  const [scores, setScores] = useState({
    sparquote: 0,
    notgroschen: 0,
    schulden: 0,
    finanzielleBasis: 0,
    personenversicherungen: 0,
    sachversicherungen: 0,
    notfallordner: 0,
    risikoabsicherung: 0,
    vermoegensanlage: 0,
    altersvorsorge: 0,
    anlageVermoegensbasis: 0,
    gesamtscore: 0
  });
  
  // Category-specific colors
  const CATEGORY_COLORS = {
    finanzielleBasis: '#0088FE', // Blue
    risikoabsicherung: '#00C49F', // Green
    vermoegenAnlage: '#FFBB28'  // Yellow
  };
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const STATUS_COLORS = {
    excellent: '#4CAF50',
    good: '#8BC34A',
    average: '#FFC107',
    poor: '#FF9800',
    critical: '#F44336'
  };
  
  // Calculate all scores when form data changes
  useEffect(() => {
    // Calculate scores based on formData
    const calculatedScores = calculateScores(formData);
    setScores(calculatedScores);
  }, [formData]);
  
  // Set document title and favicon
  useEffect(() => {
    document.title = "Financial Wellbeing Dashboard";
    
    // Create link element for favicon
    const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = 'Icon.png';
    document.head.appendChild(link);
  }, []);
  
  // Helper function to calculate all scores
  const calculateScores = (data) => {
    // Extract data
    const { einkommen, fixeKosten, variableKosten, notgroschen, dispoKredite, ratenKredite,
            versicherungen, notfallordner, vermoegenAnlage, altersvorsorge } = data;
    
    // 1. Calculate Sparquote Score
    const monatUeberschuss = einkommen - fixeKosten - variableKosten;
    const sparquote = monatUeberschuss / einkommen;
    const sparquoteScore = Math.min(1, Math.max(0, sparquote)) * 100;
    
    // 2. Calculate Notgroschen Score
    const monatsausgaben = fixeKosten + variableKosten;
    const notgroschenSoll = 3 * monatsausgaben;
    const notgroschenScore = Math.min(100, (notgroschen / notgroschenSoll) * 100);
    
    // 3. Calculate Schulden Score
    const gesamtschulden = dispoKredite + ratenKredite;
    const schuldenquote = gesamtschulden / (einkommen * 12);
    
    let schuldenScore;
    if (schuldenquote < 0.2) {
      schuldenScore = 100;
    } else if (schuldenquote <= 0.35) {
      schuldenScore = 100 - ((schuldenquote - 0.2) / 0.15) * 50;
    } else {
      schuldenScore = 50 - ((schuldenquote - 0.35) / 0.65) * 50;
    }
    
    // Apply malus for Dispo > 500€
    if (dispoKredite > 500) {
      schuldenScore -= 5;
    }
    
    schuldenScore = Math.max(0, schuldenScore);
    
    // 4. Calculate Finanzielle Basis Score
    const finanzielleBasisScore = (
      0.4 * notgroschenScore +
      0.35 * schuldenScore +
      0.25 * sparquoteScore
    );
    
    // 5. Calculate Personenversicherungen Score
    let personenversicherungenScore = 0;
    if (versicherungen.krankenversicherung) personenversicherungenScore += 30;
    if (versicherungen.berufsunfaehigkeit) personenversicherungenScore += 30;
    if (versicherungen.privateHaftpflicht) personenversicherungenScore += 20;
    if (versicherungen.risikoleben) personenversicherungenScore += 15;
    if (versicherungen.unfall) personenversicherungenScore += 5;
    
    // 6. Calculate Sachversicherungen Score
    let sachversicherungenScore = 0;
    if (versicherungen.privateHaftpflicht) sachversicherungenScore += 35;
    if (versicherungen.hausrat) sachversicherungenScore += 20;
    if (versicherungen.wohngebaeude) sachversicherungenScore += 20;
    if (versicherungen.rechtsschutz) sachversicherungenScore += 15;
    if (versicherungen.kfzHaftpflicht) sachversicherungenScore += 10;
    
    // 7. Calculate Notfallordner Score
    let notfallordnerScore = 0;
    if (notfallordner.vorsorgevollmacht) notfallordnerScore += 25;
    if (notfallordner.patientenverfuegung) notfallordnerScore += 20;
    if (notfallordner.betreuungsverfuegung) notfallordnerScore += 20;
    if (notfallordner.bankUnterlagen) notfallordnerScore += 20;
    if (notfallordner.testament) notfallordnerScore += 10;
    if (notfallordner.kontaktliste) notfallordnerScore += 5;
    
    // 8. Calculate Risikoabsicherung Score
    const risikoabsicherungScore = (
      0.5 * personenversicherungenScore +
      0.3 * sachversicherungenScore +
      0.2 * notfallordnerScore
    );
    
    // 9. Calculate Vermögensanlage Score - IMPROVED LOGIC
    // Calculate total investment
    const totalInvestment = 
      (vermoegenAnlage.aktienEtfs ? vermoegenAnlage.aktienEtfsBetrag || 0 : 0) +
      (vermoegenAnlage.immobilien ? vermoegenAnlage.immobilienBetrag || 0 : 0) +
      (vermoegenAnlage.anleihen ? vermoegenAnlage.anleihenBetrag || 0 : 0) +
      (vermoegenAnlage.versicherungen ? vermoegenAnlage.versicherungenBetrag || 0 : 0) +
      (vermoegenAnlage.bankeinlagen ? vermoegenAnlage.bankeinlagenBetrag || 0 : 0);
    
    // Calculate percentages for each asset class
    const percentages = totalInvestment === 0 ? null : {
      aktienEtfs: (vermoegenAnlage.aktienEtfs ? vermoegenAnlage.aktienEtfsBetrag || 0 : 0) / totalInvestment,
      immobilien: (vermoegenAnlage.immobilien ? vermoegenAnlage.immobilienBetrag || 0 : 0) / totalInvestment,
      anleihen: (vermoegenAnlage.anleihen ? vermoegenAnlage.anleihenBetrag || 0 : 0) / totalInvestment,
      versicherungen: (vermoegenAnlage.versicherungen ? vermoegenAnlage.versicherungenBetrag || 0 : 0) / totalInvestment,
      bankeinlagen: (vermoegenAnlage.bankeinlagen ? vermoegenAnlage.bankeinlagenBetrag || 0 : 0) / totalInvestment
    };
    
    // Base scores for each asset class
    const baseScores = {
      aktienEtfs: 60,
      immobilien: 40,
      anleihen: 25,
      versicherungen: 15,
      bankeinlagen: 15
    };
    
    // Calculate weighted score based on actual percentages
    let weightedScore = 0;
    if (percentages) {
      Object.keys(percentages).forEach(assetClass => {
        if (percentages[assetClass] > 0) {
          weightedScore += baseScores[assetClass] * percentages[assetClass];
        }
      });
    } else {
      // If no investments, check which types are selected and add a basic score
      if (vermoegenAnlage.aktienEtfs) weightedScore += baseScores.aktienEtfs * 0.1;
      if (vermoegenAnlage.immobilien) weightedScore += baseScores.immobilien * 0.1;
      if (vermoegenAnlage.anleihen) weightedScore += baseScores.anleihen * 0.1;
      if (vermoegenAnlage.versicherungen) weightedScore += baseScores.versicherungen * 0.1;
      if (vermoegenAnlage.bankeinlagen) weightedScore += baseScores.bankeinlagen * 0.1;
    }
    
    // Calculate concentration penalty
    let concentrationPenalty = 0;
    if (percentages) {
      Object.keys(percentages).forEach(assetClass => {
        if (percentages[assetClass] > 0.7) {
          concentrationPenalty += (percentages[assetClass] - 0.7) * 30; // Up to 9% penalty for 100% concentration
        }
      });
    }
    
    // Calculate diversification bonus
    let diversificationBonus = 0;
    if (percentages) {
      const diversifiedClasses = Object.keys(percentages).filter(assetClass => 
        percentages[assetClass] >= 0.1
      ).length;
      
      diversificationBonus = Math.min(diversifiedClasses * 5, 20); // Up to 20% bonus for having all 5 asset classes
    } else {
      // Count selected asset classes if no investments yet
      let selectedCount = 0;
      if (vermoegenAnlage.aktienEtfs) selectedCount++;
      if (vermoegenAnlage.immobilien) selectedCount++;
      if (vermoegenAnlage.anleihen) selectedCount++;
      if (vermoegenAnlage.versicherungen) selectedCount++;
      if (vermoegenAnlage.bankeinlagen) selectedCount++;
      
      diversificationBonus = Math.min(selectedCount * 3, 15); // Up to 15% bonus for selection
    }
    
    // Investment adequacy relative to income/expenses
    const monthlyExpenses = fixeKosten + variableKosten;
    const investmentTarget = monthlyExpenses * 12; // 1 year of expenses
    let adequacyBonus = 0;
    
    if (totalInvestment > 0) {
      adequacyBonus = Math.min(totalInvestment / investmentTarget * 15, 15); // Up to 15% bonus
    }
    
    // Calculate final score with all components
    const rawScore = weightedScore - concentrationPenalty + diversificationBonus + adequacyBonus;
    
    // Normalize to 0-100 scale
    const vermoegensanlageScore = Math.min(Math.max(rawScore, 0), 100);
    
    // 10. Calculate Altersvorsorge Score
    const altersvorsorgeAnsprueche = altersvorsorge.gesetzlicheRente + altersvorsorge.betrieblicheRente + altersvorsorge.privateRente;
    const altersvorsorgeScore = Math.min(100, (altersvorsorgeAnsprueche / (fixeKosten + variableKosten)) * 100);
    
    // 11. Calculate Anlage & Vermögensbasis Score
    const anlageVermoegensbasisScore = (
      0.7 * altersvorsorgeScore +
      0.3 * vermoegensanlageScore
    );
    
    // 12. Calculate Gesamtscore
    const gesamtScore = (finanzielleBasisScore + risikoabsicherungScore + anlageVermoegensbasisScore) / 3;
    
    return {
      sparquote: sparquoteScore,
      notgroschen: notgroschenScore,
      schulden: schuldenScore,
      finanzielleBasis: finanzielleBasisScore,
      personenversicherungen: personenversicherungenScore,
      sachversicherungen: sachversicherungenScore,
      notfallordner: notfallordnerScore,
      risikoabsicherung: risikoabsicherungScore,
      vermoegensanlage: vermoegensanlageScore,
      altersvorsorge: altersvorsorgeScore,
      anlageVermoegensbasis: anlageVermoegensbasisScore,
      gesamtscore: gesamtScore
    };
  };

  // Helper function to get status color based on score and category
  const getStatusColor = (score, category) => {
    // Use category-specific colors for pillar scores
    if (category === 'finanzielleBasis') return CATEGORY_COLORS.finanzielleBasis;
    if (category === 'risikoabsicherung') return CATEGORY_COLORS.risikoabsicherung;
    if (category === 'anlageVermoegensbasis') return CATEGORY_COLORS.vermoegenAnlage;
    
    // For sub-categories, determine their parent category and use that color
    if (['notgroschen', 'schulden', 'sparquote'].includes(category)) {
      return CATEGORY_COLORS.finanzielleBasis;
    }
    
    if (['personenversicherungen', 'sachversicherungen', 'notfallordner'].includes(category)) {
      return CATEGORY_COLORS.risikoabsicherung;
    }
    
    if (['vermoegensanlage', 'altersvorsorge'].includes(category)) {
      return CATEGORY_COLORS.vermoegenAnlage;
    }
    
    // For generic scores without category, use status-based coloring
    if (score >= 90) return STATUS_COLORS.excellent;
    if (score >= 75) return STATUS_COLORS.good;
    if (score >= 60) return STATUS_COLORS.average;
    if (score >= 40) return STATUS_COLORS.poor;
    return STATUS_COLORS.critical;
  };
  
  // Generate recommendations based on scores
  const getRecommendations = () => {
    const recommendations = [];
    
    // Financial Basis recommendations
    if (scores.notgroschen < 60) {
      recommendations.push({
        category: "Finanzielle Basis",
        title: "Notgroschen aufbauen",
        description: "Erhöhe deinen Notgroschen auf mindestens 3 Monatsausgaben, um finanzielle Engpässe zu überbrücken."
      });
    }
    
    if (scores.schulden < 70) {
      recommendations.push({
        category: "Finanzielle Basis",
        title: "Schulden reduzieren",
        description: "Konzentriere dich auf die Rückzahlung deiner Schulden, besonders teure Dispokredite."
      });
    }
    
    if (scores.sparquote < 50) {
      recommendations.push({
        category: "Finanzielle Basis",
        title: "Sparquote erhöhen",
        description: "Überprüfe deine variablen Ausgaben und versuche, deine monatliche Sparrate zu erhöhen."
      });
    }
    
    // Risk Protection recommendations
    if (scores.personenversicherungen < 70) {
      const missingInsurance = [];
      if (!formData.versicherungen.krankenversicherung) missingInsurance.push("Krankenversicherung");
      if (!formData.versicherungen.berufsunfaehigkeit) missingInsurance.push("Berufsunfähigkeitsversicherung");
      if (!formData.versicherungen.privateHaftpflicht) missingInsurance.push("Private Haftpflichtversicherung");
      
      if (missingInsurance.length > 0) {
        recommendations.push({
          category: "Risikoabsicherung",
          title: "Personenversicherungen ergänzen",
          description: `Erwäge den Abschluss folgender wichtiger Versicherungen: ${missingInsurance.join(", ")}.`
        });
      }
    }
    
    if (scores.sachversicherungen < 60) {
      const missingInsurance = [];
      if (!formData.versicherungen.privateHaftpflicht) missingInsurance.push("Private Haftpflichtversicherung");
      if (!formData.versicherungen.hausrat) missingInsurance.push("Hausratversicherung");
      
      if (missingInsurance.length > 0) {
        recommendations.push({
          category: "Risikoabsicherung",
          title: "Sachversicherungen ergänzen",
          description: `Prüfe den Abschluss folgender Versicherungen: ${missingInsurance.join(", ")}.`
        });
      }
    }
    
    if (scores.notfallordner < 50) {
      recommendations.push({
        category: "Risikoabsicherung",
        title: "Notfallordner vervollständigen",
        description: "Erstelle wichtige Dokumente wie Vorsorgevollmacht und Patientenverfügung für den Notfall."
      });
    }
    
    // Investment & Asset Base recommendations
    if (scores.vermoegensanlage < 60) {
      if (!formData.vermoegenAnlage.aktienEtfs) {
        recommendations.push({
          category: "Anlage & Vermögensbasis",
          title: "Diversifikation verbessern",
          description: "Erwäge Investments in Aktien oder ETFs, um deine Rendite zu steigern und besser zu diversifizieren."
        });
      } else if (!formData.vermoegenAnlage.immobilien && !formData.vermoegenAnlage.anleihen) {
        recommendations.push({
          category: "Anlage & Vermögensbasis",
          title: "Anlageklassen erweitern",
          description: "Ergänze dein Portfolio um weitere Anlageklassen wie Immobilien oder Anleihen."
        });
      }
    }
    
    if (scores.altersvorsorge < 70) {
      recommendations.push({
        category: "Anlage & Vermögensbasis",
        title: "Altersvorsorge ausbauen",
        description: "Erhöhe deine Altersvorsorge, um im Ruhestand deinen Lebensstandard zu sichern."
      });
    }
    
    return recommendations;
  };
  
  // Prepare data for charts
  const pillarData = [
    { name: 'Finanzielle Basis', value: scores.finanzielleBasis, color: getStatusColor(scores.finanzielleBasis, 'finanzielleBasis'), category: 'finanzielleBasis' },
    { name: 'Risikoabsicherung', value: scores.risikoabsicherung, color: getStatusColor(scores.risikoabsicherung, 'risikoabsicherung'), category: 'risikoabsicherung' },
    { name: 'Anlage & Vermögensbasis', value: scores.anlageVermoegensbasis, color: getStatusColor(scores.anlageVermoegensbasis, 'anlageVermoegensbasis'), category: 'anlageVermoegensbasis' }
  ];
  
  const detailData = [
    { name: 'Notgroschen', value: scores.notgroschen, color: getStatusColor(scores.notgroschen, 'notgroschen'), category: 'finanzielleBasis' },
    { name: 'Schulden', value: scores.schulden, color: getStatusColor(scores.schulden, 'schulden'), category: 'finanzielleBasis' },
    { name: 'Sparquote', value: scores.sparquote, color: getStatusColor(scores.sparquote, 'sparquote'), category: 'finanzielleBasis' },
    { name: 'Personenversicherungen', value: scores.personenversicherungen, color: getStatusColor(scores.personenversicherungen, 'personenversicherungen'), category: 'risikoabsicherung' },
    { name: 'Sachversicherungen', value: scores.sachversicherungen, color: getStatusColor(scores.sachversicherungen, 'sachversicherungen'), category: 'risikoabsicherung' },
    { name: 'Notfallordner', value: scores.notfallordner, color: getStatusColor(scores.notfallordner, 'notfallordner'), category: 'risikoabsicherung' },
    { name: 'Vermögensanlage', value: scores.vermoegensanlage, color: getStatusColor(scores.vermoegensanlage, 'vermoegensanlage'), category: 'anlageVermoegensbasis' },
    { name: 'Altersvorsorge', value: scores.altersvorsorge, color: getStatusColor(scores.altersvorsorge, 'altersvorsorge'), category: 'anlageVermoegensbasis' }
  ];
  
  // Generate recommendations
  const recommendations = getRecommendations();
  
  // Handle form input changes
  const handleInputChange = (e, section, subsection) => {
    const { name, value, type, checked } = e.target;
    
    // Convert value to number or use 0 if empty for number fields
    const numValue = type === 'number' ? (value === '' ? 0 : Number(value)) : value;
    
    if (section) {
      if (subsection) {
        // Handle nested subsection (like versicherungen.krankenversicherung)
        setFormData(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            [subsection]: {
              ...prev[section][subsection],
              [name]: type === 'checkbox' ? checked : numValue
            }
          }
        }));
      } else {
        // Handle section with direct property (like versicherungen.krankenversicherung)
        setFormData(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            [name]: type === 'checkbox' ? checked : numValue
          }
        }));
      }
    } else {
      // Handle top-level property
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : numValue
      }));
    }
    
    // Special handling: if unchecking an investment type, reset its amount to 0
    if (type === 'checkbox' && !checked && section === 'vermoegenAnlage') {
      if (name === 'aktienEtfs') {
        setFormData(prev => ({
          ...prev,
          vermoegenAnlage: {
            ...prev.vermoegenAnlage,
            aktienEtfsBetrag: 0
          }
        }));
      } else if (name === 'immobilien') {
        setFormData(prev => ({
          ...prev,
          vermoegenAnlage: {
            ...prev.vermoegenAnlage,
            immobilienBetrag: 0
          }
        }));
      } else if (name === 'anleihen') {
        setFormData(prev => ({
          ...prev,
          vermoegenAnlage: {
            ...prev.vermoegenAnlage,
            anleihenBetrag: 0
          }
        }));
      } else if (name === 'versicherungen') {
        setFormData(prev => ({
          ...prev,
          vermoegenAnlage: {
            ...prev.vermoegenAnlage,
            versicherungenBetrag: 0
          }
        }));
      } else if (name === 'bankeinlagen') {
        setFormData(prev => ({
          ...prev,
          vermoegenAnlage: {
            ...prev.vermoegenAnlage,
            bankeinlagenBetrag: 0
          }
        }));
      }
    }
  };
  
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-3 sm:p-6 min-h-screen">
      <header className="mb-6 sm:mb-8 relative">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Financial Wellbeing Dashboard
          </h1>
          <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <img src={rolandBergerLogo} alt="Roland Berger" className="h-6 sm:h-10" />
            <img src={hoftLogo} alt="HoFT" className="h-6 sm:h-10" />
          </div>
        </div>
        <div className="w-full h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mt-2"></div>
      </header>
      
      {/* Overall Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-700 flex flex-col items-center justify-center">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Gesamtscore</h2>
          <div className="relative w-36 sm:w-48 h-36 sm:h-48 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-8 border-gray-700"></div>
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={getStatusColor(scores.gesamtscore)}
                strokeWidth="3"
                strokeDasharray={`${scores.gesamtscore}, 100`}
                strokeLinecap="round"
                className="transform -rotate-90 origin-center"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl sm:text-4xl font-bold">{Math.round(scores.gesamtscore)}%</span>
              <span className="text-xs sm:text-sm text-gray-400 mt-1">Gesamt</span>
            </div>
          </div>
        </div>
        
        {/* Pillar Scores */}
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-700 col-span-1 lg:col-span-2">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Scores Bedarfsfelder</h2>
          <div className="flex flex-col sm:flex-row items-center justify-around h-auto sm:h-48">
            {pillarData.map((entry, index) => (
              <div key={`pillar-${index}`} className="flex flex-col items-center mb-6 sm:mb-0 w-full sm:w-auto">
                <div className="relative w-28 sm:w-32 h-28 sm:h-32 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={entry.color}
                      strokeWidth="3"
                      strokeDasharray={`${entry.value}, 100`}
                      strokeLinecap="round"
                      className="transform -rotate-90 origin-center"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl sm:text-2xl font-bold">{Math.round(entry.value)}%</span>
                  </div>
                </div>
                <span className="text-xs sm:text-sm mt-2 text-center max-w-36" style={{ color: entry.color }}>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Data Entry Form moved inside gray boxes for each content category */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Financial Basis Box */}
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-700">
          <h3 className="font-medium text-lg mb-4" style={{ color: CATEGORY_COLORS.finanzielleBasis }}>Finanzielle Basis</h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Einkommen (€/Monat)</label>
              <input
                type="number"
                name="einkommen"
                value={formData.einkommen}
                onChange={(e) => handleInputChange(e)}
                className="w-full bg-gray-700 rounded px-3 py-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Fixe Kosten (€/Monat)</label>
              <input
                type="number"
                name="fixeKosten"
                value={formData.fixeKosten}
                onChange={(e) => handleInputChange(e)}
                className="w-full bg-gray-700 rounded px-3 py-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Variable Kosten (€/Monat)</label>
              <input
                type="number"
                name="variableKosten"
                value={formData.variableKosten}
                onChange={(e) => handleInputChange(e)}
                className="w-full bg-gray-700 rounded px-3 py-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Notgroschen (€)</label>
              <input
                type="number"
                name="notgroschen"
                value={formData.notgroschen}
                onChange={(e) => handleInputChange(e)}
                className="w-full bg-gray-700 rounded px-3 py-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Dispo-Kredite (€)</label>
              <input
                type="number"
                name="dispoKredite"
                value={formData.dispoKredite}
                onChange={(e) => handleInputChange(e)}
                className="w-full bg-gray-700 rounded px-3 py-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Ratenkredite (€)</label>
              <input
                type="number"
                name="ratenKredite"
                value={formData.ratenKredite}
                onChange={(e) => handleInputChange(e)}
                className="w-full bg-gray-700 rounded px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>
        
        {/* Risk Protection Box */}
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-700">
          <h3 className="font-medium text-lg mb-4" style={{ color: CATEGORY_COLORS.risikoabsicherung }}>Risikoabsicherung</h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm" style={{ color: CATEGORY_COLORS.risikoabsicherung }}>Personenversicherungen</h4>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="krankenversicherung"
                  checked={formData.versicherungen.krankenversicherung}
                  onChange={(e) => handleInputChange(e, 'versicherungen')}
                  className="mr-2"
                />
                <label className="text-sm">Krankenversicherung</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="berufsunfaehigkeit"
                  checked={formData.versicherungen.berufsunfaehigkeit}
                  onChange={(e) => handleInputChange(e, 'versicherungen')}
                  className="mr-2"
                />
                <label className="text-sm">Berufsunfähigkeit</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="privateHaftpflicht"
                  checked={formData.versicherungen.privateHaftpflicht}
                  onChange={(e) => handleInputChange(e, 'versicherungen')}
                  className="mr-2"
                />
                <label className="text-sm">Private Haftpflicht</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="risikoleben"
                  checked={formData.versicherungen.risikoleben}
                  onChange={(e) => handleInputChange(e, 'versicherungen')}
                  className="mr-2"
                />
                <label className="text-sm">Risikoleben</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="unfall"
                  checked={formData.versicherungen.unfall}
                  onChange={(e) => handleInputChange(e, 'versicherungen')}
                  className="mr-2"
                />
                <label className="text-sm">Unfallversicherung</label>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm" style={{ color: CATEGORY_COLORS.risikoabsicherung }}>Sachversicherungen</h4>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="hausrat"
                  checked={formData.versicherungen.hausrat}
                  onChange={(e) => handleInputChange(e, 'versicherungen')}
                  className="mr-2"
                />
                <label className="text-sm">Hausrat</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="wohngebaeude"
                  checked={formData.versicherungen.wohngebaeude}
                  onChange={(e) => handleInputChange(e, 'versicherungen')}
                  className="mr-2"
                />
                <label className="text-sm">Wohngebäude</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="rechtsschutz"
                  checked={formData.versicherungen.rechtsschutz}
                  onChange={(e) => handleInputChange(e, 'versicherungen')}
                  className="mr-2"
                />
                <label className="text-sm">Rechtsschutz</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="kfzHaftpflicht"
                  checked={formData.versicherungen.kfzHaftpflicht}
                  onChange={(e) => handleInputChange(e, 'versicherungen')}
                  className="mr-2"
                />
                <label className="text-sm">KFZ-Haftpflicht</label>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm" style={{ color: CATEGORY_COLORS.risikoabsicherung }}>Notfallordner</h4>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="vorsorgevollmacht"
                  checked={formData.notfallordner.vorsorgevollmacht}
                  onChange={(e) => handleInputChange(e, 'notfallordner')}
                  className="mr-2"
                />
                <label className="text-sm">Vorsorgevollmacht</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="patientenverfuegung"
                  checked={formData.notfallordner.patientenverfuegung}
                  onChange={(e) => handleInputChange(e, 'notfallordner')}
                  className="mr-2"
                />
                <label className="text-sm">Patientenverfügung</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="betreuungsverfuegung"
                  checked={formData.notfallordner.betreuungsverfuegung}
                  onChange={(e) => handleInputChange(e, 'notfallordner')}
                  className="mr-2"
                />
                <label className="text-sm">Betreuungsverfügung</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="bankUnterlagen"
                  checked={formData.notfallordner.bankUnterlagen}
                  onChange={(e) => handleInputChange(e, 'notfallordner')}
                  className="mr-2"
                />
                <label className="text-sm">Bank- und Versicherungsunterlagen</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="testament"
                  checked={formData.notfallordner.testament}
                  onChange={(e) => handleInputChange(e, 'notfallordner')}
                  className="mr-2"
                />
                <label className="text-sm">Testament oder Erbvertrag</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="kontaktliste"
                  checked={formData.notfallordner.kontaktliste}
                  onChange={(e) => handleInputChange(e, 'notfallordner')}
                  className="mr-2"
                />
                <label className="text-sm">Kontaktliste für Notfälle</label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Investment & Asset Base Box */}
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-700">
          <h3 className="font-medium text-lg mb-4" style={{ color: CATEGORY_COLORS.vermoegenAnlage }}>Anlage & Vermögensbasis</h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm" style={{ color: CATEGORY_COLORS.vermoegenAnlage }}>Vermögensanlage</h4>
              
              <div className="space-y-1 mb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="aktienEtfs"
                    checked={formData.vermoegenAnlage.aktienEtfs}
                    onChange={(e) => handleInputChange(e, 'vermoegenAnlage')}
                    className="mr-2"
                  />
                  <label className="text-sm">Aktien/ETFs</label>
                </div>
                {formData.vermoegenAnlage.aktienEtfs && (
                  <div className="ml-6">
                    <input
                      type="number"
                      name="aktienEtfsBetrag"
                      value={formData.vermoegenAnlage.aktienEtfsBetrag}
                      onChange={(e) => handleInputChange(e, 'vermoegenAnlage')}
                      className="bg-gray-700 rounded px-3 py-1 text-white text-sm w-full md:w-3/4"
                      placeholder="Betrag in €"
                      min="0"
                      required
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-1 mb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="immobilien"
                    checked={formData.vermoegenAnlage.immobilien}
                    onChange={(e) => handleInputChange(e, 'vermoegenAnlage')}
                    className="mr-2"
                  />
                  <label className="text-sm">Immobilien</label>
                </div>
                {formData.vermoegenAnlage.immobilien && (
                  <div className="ml-6">
                    <input
                      type="number"
                      name="immobilienBetrag"
                      value={formData.vermoegenAnlage.immobilienBetrag}
                      onChange={(e) => handleInputChange(e, 'vermoegenAnlage')}
                      className="bg-gray-700 rounded px-3 py-1 text-white text-sm w-full md:w-3/4"
                      placeholder="Betrag in €"
                      min="0"
                      required
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-1 mb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="anleihen"
                    checked={formData.vermoegenAnlage.anleihen}
                    onChange={(e) => handleInputChange(e, 'vermoegenAnlage')}
                    className="mr-2"
                  />
                  <label className="text-sm">Anleihen/Rentenfonds</label>
                </div>
                {formData.vermoegenAnlage.anleihen && (
                  <div className="ml-6">
                    <input
                      type="number"
                      name="anleihenBetrag"
                      value={formData.vermoegenAnlage.anleihenBetrag}
                      onChange={(e) => handleInputChange(e, 'vermoegenAnlage')}
                      className="bg-gray-700 rounded px-3 py-1 text-white text-sm w-full md:w-3/4"
                      placeholder="Betrag in €"
                      min="0"
                      required
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-1 mb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="versicherungen"
                    checked={formData.vermoegenAnlage.versicherungen}
                    onChange={(e) => handleInputChange(e, 'vermoegenAnlage')}
                    className="mr-2"
                  />
                  <label className="text-sm">Lebens-/Rentenversicherungen</label>
                </div>
                {formData.vermoegenAnlage.versicherungen && (
                  <div className="ml-6">
                    <input
                      type="number"
                      name="versicherungenBetrag"
                      value={formData.vermoegenAnlage.versicherungenBetrag}
                      onChange={(e) => handleInputChange(e, 'vermoegenAnlage')}
                      className="bg-gray-700 rounded px-3 py-1 text-white text-sm w-full md:w-3/4"
                      placeholder="Betrag in €"
                      min="0"
                      required
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-1 mb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="bankeinlagen"
                    checked={formData.vermoegenAnlage.bankeinlagen}
                    onChange={(e) => handleInputChange(e, 'vermoegenAnlage')}
                    className="mr-2"
                  />
                  <label className="text-sm">Bankeinlagen (Tagesgeld, etc.)</label>
                </div>
                {formData.vermoegenAnlage.bankeinlagen && (
                  <div className="ml-6">
                    <input
                      type="number"
                      name="bankeinlagenBetrag"
                      value={formData.vermoegenAnlage.bankeinlagenBetrag}
                      onChange={(e) => handleInputChange(e, 'vermoegenAnlage')}
                      className="bg-gray-700 rounded px-3 py-1 text-white text-sm w-full md:w-3/4"
                      placeholder="Betrag in €"
                      min="0"
                      required
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm" style={{ color: CATEGORY_COLORS.vermoegenAnlage }}>Altersvorsorge (€/Monat)</h4>
              
              <div>
                <label className="block text-sm mb-1">Gesetzliche Rente</label>
                <input
                  type="number"
                  name="gesetzlicheRente"
                  value={formData.altersvorsorge.gesetzlicheRente}
                  onChange={(e) => handleInputChange(e, 'altersvorsorge')}
                  className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Betriebliche Rente</label>
                <input
                  type="number"
                  name="betrieblicheRente"
                  value={formData.altersvorsorge.betrieblicheRente}
                  onChange={(e) => handleInputChange(e, 'altersvorsorge')}
                  className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Private Rente</label>
                <input
                  type="number"
                  name="privateRente"
                  value={formData.altersvorsorge.privateRente}
                  onChange={(e) => handleInputChange(e, 'altersvorsorge')}
                  className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Category Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-700 col-span-1 lg:col-span-3">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Detailanalyse</h2>
          <div className="h-64 sm:h-300 overflow-x-auto">
            <ResponsiveContainer width="100%" height={300} minWidth={600}>
              <BarChart
                data={detailData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#555" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#ccc' }} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={(props) => {
                    const { x, y, payload } = props;
                    const item = detailData.find(d => d.name === payload.value);
                    const textColor = item ? item.color : '#ccc';
                    return (
                      <text x={x} y={y} dy={4} textAnchor="end" fill={textColor} fontSize={12}>
                        {payload.value}
                      </text>
                    );
                  }}
                  width={120} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#333', border: 'none' }}
                  formatter={(value) => [`${Math.round(value)}%`, 'Score']}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {detailData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="mt-6 sm:mt-8 bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-emerald-400 opacity-10 transform rotate-45 translate-x-16 -translate-y-8"></div>
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Empfehlungen</h2>
        <div className="space-y-4 pr-2">
          {recommendations.length > 0 ? (
            recommendations.map((rec, index) => (
              <div 
                key={`rec-${index}`} 
                className="p-3 sm:p-4 rounded-lg bg-gray-700 border-l-4"
                style={{ borderLeftColor: 
                  rec.category === "Finanzielle Basis" ? CATEGORY_COLORS.finanzielleBasis : 
                  rec.category === "Risikoabsicherung" ? CATEGORY_COLORS.risikoabsicherung : 
                  CATEGORY_COLORS.vermoegenAnlage 
                }}
              >
                <div className="text-xs sm:text-sm" style={{ 
                  color: rec.category === "Finanzielle Basis" ? CATEGORY_COLORS.finanzielleBasis : 
                         rec.category === "Risikoabsicherung" ? CATEGORY_COLORS.risikoabsicherung : 
                         CATEGORY_COLORS.vermoegenAnlage 
                }}>{rec.category}</div>
                <h3 className="font-medium mb-1 text-sm sm:text-base">{rec.title}</h3>
                <p className="text-xs sm:text-sm text-gray-300">{rec.description}</p>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-6">
              Super! Deine finanzielle Situation ist ausgezeichnet.
            </div>
          )}
        </div>
      </div>
      
      <footer className="mt-6 sm:mt-8 text-center text-gray-400 text-xs sm:text-sm">
        <p>© 2025 House of Finance & Tech // entwickelt von Markus Lehleiter</p>
      </footer>
    </div>
  );
};

export default FinanzkompassDashboard;
