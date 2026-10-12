// Inicializa os Ícones Lucide
lucide.createIcons();

// Coordenadas Fixas da UNINASSAU Fortaleza (Campus Dorotéias - Av. Visconde do Rio Branco, 2078)
const UNINASSAU_COORDS = {
  lat: -3.7441,
  lon: -38.5173
};

// Formatação automática do campo CEP (XXXXX-XXX)
document.getElementById('cep').addEventListener('input', (e) => {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length > 5) {
    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
  }
  e.target.value = value;
});

async function calcularFrete(event) {
  event.preventDefault();

  const cepInput = document.getElementById('cep').value.replace(/\D/g, '');
  const errorMsg = document.getElementById('errorMsg');
  const loading = document.getElementById('loading');
  const resultado = document.getElementById('resultado');

  // Ocultar resultados/erros anteriores
  errorMsg.classList.add('hidden');
  resultado.classList.add('hidden');

  if (cepInput.length !== 8) {
    mostrarErro('Por favor, digite um CEP válido com 8 dígitos.');
    return;
  }

  // Exibir loader
  loading.classList.remove('hidden');

  try {
    // 1. Consulta API Pública ViaCEP
    const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cepInput}/json/`);
    const cepData = await viaCepResponse.json();

    if (cepData.erro) {
      throw new Error('CEP não encontrado. Verifique o número digitado.');
    }

    // 2. Obter Coordenadas do Destino via OpenStreetMap (Nominatim)
    const query = encodeURIComponent(`${cepData.logradouro}, ${cepData.bairro}, ${cepData.localidade} - ${cepData.uf}, Brasil`);
    const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
    const geoData = await geoResponse.json();

    let destLat, destLon;

    if (geoData && geoData.length > 0) {
      destLat = parseFloat(geoData[0].lat);
      destLon = parseFloat(geoData[0].lon);
    } else {
      // Fallback para cidade/bairro caso o logradouro exato não seja localizado
      const fallbackQuery = encodeURIComponent(`${cepData.bairro}, ${cepData.localidade} - ${cepData.uf}, Brasil`);
      const fallbackResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${fallbackQuery}`);
      const fallbackData = await fallbackResponse.json();

      if (fallbackData && fallbackData.length > 0) {
        destLat = parseFloat(fallbackData[0].lat);
        destLon = parseFloat(fallbackData[0].lon);
      } else {
        throw new Error('Não foi possível obter a localização exata deste CEP.');
      }
    }

    // 3. Calcular Distância pela Fórmula de Haversine (Linha Reta + Fator Rota 1.35)
    const distanciaKm = calcularHaversine(UNINASSAU_COORDS.lat, UNINASSAU_COORDS.lon, destLat, destLon) * 1.35;

    // 4. Calcular Preço do Uber Moto
    // Regra: Taxa Base = R$ 4,50 | R$ 1,40 por Km | Valor Mínimo = R$ 6,00
    const taxaBase = 4.50;
    const precoPorKm = 1.40;
    const valorKmTotal = distanciaKm * precoPorKm;
    let precoTotal = taxaBase + valorKmTotal;

    if (precoTotal < 6.00) {
      precoTotal = 6.00;
    }

    // 5. Exibir Resultados no DOM
    document.getElementById('resLogradouro').textContent = cepData.logradouro || 'Endereço Genérico';
    document.getElementById('resBairroCidade').textContent = `${cepData.bairro} - ${cepData.localidade}/${cepData.uf}`;
    document.getElementById('resDistancia').textContent = `${distanciaKm.toFixed(1)} km`;
    document.getElementById('resPreco').textContent = `R$ ${precoTotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('resValorKm').textContent = `R$ ${valorKmTotal.toFixed(2).replace('.', ',')}`;

    loading.classList.add('hidden');
    resultado.classList.remove('hidden');

  } catch (err) {
    loading.classList.add('hidden');
    mostrarErro(err.message || 'Erro ao consultar o CEP. Tente novamente.');
  }
}

// Função Auxiliar: Fórmula de Haversine
function calcularHaversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raio da Terra em km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

function mostrarErro(mensagem) {
  const errorMsg = document.getElementById('errorMsg');
  errorMsg.textContent = mensagem;
  errorMsg.classList.remove('hidden');
}