#!/bin/bash

# Verifica se a variável GEMINI_API_KEY está definida
if [ -z "$GEMINI_API_KEY" ]; then
  echo "Erro: A variável GEMINI_API_KEY não está definida."
  exit 1
fi

echo "Variável GEMINI_API_KEY está definida. Continuando..."

echo "instalando a aplicação..."
cd /usr/app/src
npm install

# Iniciar a aplicação Node.js
echo "Iniciando aplicação"
exec npm run start