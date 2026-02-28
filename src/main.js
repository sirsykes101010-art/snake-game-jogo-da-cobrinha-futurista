// State management
let searchHistory = JSON.parse(localStorage.getItem('creativeSearchHistory')) || [];
let totalSearches = parseInt(localStorage.getItem('totalSearches')) || 0;
let totalInsights = parseInt(localStorage.getItem('totalInsights')) || 0;
let apiKey = localStorage.getItem('openaiApiKey') || '';

// DOM elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsSection = document.getElementById('resultsSection');
const loadingState = document.getElementById('loadingState');
const resultsGrid = document.getElementById('resultsGrid');
const insightsContent = document.getElementById('insightsContent');
const historyList = document.getElementById('historyList');
const apiKeyModal = document.getElementById('apiKeyModal');
const totalSearchesEl = document.getElementById('totalSearches');
const totalInsightsEl = document.getElementById('totalInsights');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateStats();
  renderHistory();
  
  // Check if API key exists
  if (!apiKey) {
    setTimeout(() => {
      apiKeyModal.classList.add('active');
    }, 1000);
  }
});

// Update statistics
function updateStats() {
  totalSearchesEl.textContent = totalSearches;
  totalInsightsEl.textContent = totalInsights;
}

// Search functionality
searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    performSearch();
  }
});

// Category tags
document.querySelectorAll('.category-tag').forEach(tag => {
  tag.addEventListener('click', () => {
    const category = tag.dataset.category;
    searchInput.value = `Melhores criativos para ${category}`;
    performSearch();
  });
});

async function performSearch() {
  const query = searchInput.value.trim();
  if (!query) return;
  
  if (!apiKey) {
    apiKeyModal.classList.add('active');
    return;
  }
  
  // Show loading state
  resultsSection.classList.add('active');
  loadingState.classList.add('active');
  resultsGrid.innerHTML = '';
  insightsContent.innerHTML = '';
  
  // Simulate API call (replace with actual OpenAI API call)
  try {
    // Add to history
    addToHistory(query);
    totalSearches++;
    localStorage.setItem('totalSearches', totalSearches);
    updateStats();
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock results (replace with actual API response)
    const results = generateMockResults(query);
    const insights = generateMockInsights(query);
    
    // Hide loading
    loadingState.classList.remove('active');
    
    // Render results
    renderResults(results);
    renderInsights(insights);
    
    totalInsights += insights.length;
    localStorage.setItem('totalInsights', totalInsights);
    updateStats();
    
  } catch (error) {
    console.error('Search error:', error);
    loadingState.classList.remove('active');
    showError('Erro ao realizar pesquisa. Tente novamente.');
  }
}

// Generate mock results (replace with actual API integration)
function generateMockResults(query) {
  const categories = [
    {
      title: 'Anúncio de Alta Conversão',
      description: 'Este criativo alcançou 12% de CTR com uma abordagem visual minimalista e copy direto ao ponto.',
      metrics: { ctr: '12%', conversao: '3.5%', roi: '450%' },
      badge: 'Top Performer'
    },
    {
      title: 'Vídeo Viral de Produto',
      description: 'Formato de vídeo curto que gerou 2M de visualizações orgânicas em 48 horas.',
      metrics: { views: '2M', engagement: '8.7%', shares: '45K' },
      badge: 'Viral'
    },
    {
      title: 'Campanha de Stories',
      description: 'Sequência de stories interativos com quiz que aumentou o engajamento em 300%.',
      metrics: { engagement: '15%', completion: '67%', clicks: '25K' },
      badge: 'Alto Engajamento'
    },
    {
      title: 'Banner Responsivo Premium',
      description: 'Design adaptativo que mantém alta performance em todos os dispositivos.',
      metrics: { mobile: '18% CTR', desktop: '14% CTR', tablet: '16% CTR' },
      badge: 'Multi-Device'
    }
  ];
  
  return categories;
}

// Generate mock insights (replace with actual AI analysis)
function generateMockInsights(query) {
  return [
    {
      title: '🎯 Elementos Visuais Chave',
      content: 'Os criativos de maior sucesso nesta categoria utilizam cores vibrantes com alto contraste, imagens de pessoas reais (não stock photos) e CTAs claros posicionados estrategicamente.'
    },
    {
      title: '📝 Copywriting Efetivo',
      content: 'Headlines curtos (5-7 palavras) com benefícios claros performam 40% melhor. Use números específicos e urgência moderada para aumentar conversões.'
    },
    {
      title: '📱 Formatos Recomendados',
      content: 'Vídeos verticais de 15-30 segundos têm o melhor ROI. Para imagens estáticas, carrosséis com 3-5 slides geram 2.5x mais engajamento.'
    },
    {
      title: '⚡ Tendências Atuais',
      content: 'UGC (User Generated Content) está dominando com 3x mais engajamento. Micro-influenciadores geram melhor ROI que celebridades.'
    }
  ];
}

// Render results
function renderResults(results) {
  resultsGrid.innerHTML = results.map((result, index) => `
    <div class="result-card" onclick="openResult(${index})">
      <div class="result-image">
        <div class="result-badge">${result.badge}</div>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="width: 80px; height: 80px; opacity: 0.3;">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="9" y1="9" x2="15" y2="9"/>
          <line x1="9" y1="12" x2="15" y2="12"/>
          <line x1="9" y1="15" x2="11" y2="15"/>
        </svg>
      </div>
      <div class="result-content">
        <h3 class="result-title">${result.title}</h3>
        <p class="result-description">${result.description}</p>
        <div class="result-metrics">
          ${Object.entries(result.metrics).map(([key, value]) => `
            <div class="metric">
              <span class="metric-value">${value}</span>
              <span class="metric-label">${key}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

// Render insights
function renderInsights(insights) {
  insightsContent.innerHTML = insights.map(insight => `
    <div class="insight-item">
      <h4>${insight.title}</h4>
      <p>${insight.content}</p>
    </div>
  `).join('');
}

// Add to history
function addToHistory(query) {
  const historyItem = {
    query,
    date: new Date().toISOString()
  };
  
  searchHistory.unshift(historyItem);
  if (searchHistory.length > 10) {
    searchHistory = searchHistory.slice(0, 10);
  }
  
  localStorage.setItem('creativeSearchHistory', JSON.stringify(searchHistory));
  renderHistory();
}

// Render history
function renderHistory() {
  if (searchHistory.length === 0) {
    historyList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Nenhuma pesquisa realizada ainda</p>';
    return;
  }
  
  historyList.innerHTML = searchHistory.map((item, index) => `
    <div class="history-item" onclick="loadHistoryItem(${index})">
      <div class="history-text">
        <div class="history-query">${item.query}</div>
        <div class="history-date">${formatDate(item.date)}</div>
      </div>
      <svg class="history-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>
  `).join('');
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'Agora mesmo';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} minutos atrás`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} horas atrás`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} dias atrás`;
  
  return date.toLocaleDateString('pt-BR');
}

// Load history item
window.loadHistoryItem = function(index) {
  const item = searchHistory[index];
  searchInput.value = item.query;
  performSearch();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Open result
window.openResult = function(index) {
  // In a real implementation, this would open a detailed view
  console.log('Opening result:', index);
};

// API Key Modal functions
window.closeApiKeyModal = function() {
  apiKeyModal.classList.remove('active');
};

window.saveApiKey = function() {
  const input = document.getElementById('apiKeyInput');
  const key = input.value.trim();
  
  if (key && key.startsWith('sk-')) {
    apiKey = key;
    localStorage.setItem('openaiApiKey', key);
    apiKeyModal.classList.remove('active');
    input.value = '';
  } else {
    alert('Por favor, insira uma API Key válida da OpenAI');
  }
};

// Show error message
function showError(message) {
  resultsGrid.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
      <p style="color: var(--error); font-size: 18px;">${message}</p>
    </div>
  `;
}

// Filter button (placeholder)
document.getElementById('filterButton').addEventListener('click', () => {
  alert('Filtros em desenvolvimento!');
});
