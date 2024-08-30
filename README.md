# SmartMeter

SmartMeter é uma API REST que utiliza IA para a leitura individualizada de consumo de água e gás a partir de fotos de medidores. Este projeto inclui um backend para processamento de dados e oferece endpoints para a integração com interfaces de usuário e outros serviços.

## Requisitos
Antes de começar, verifique se você tem os seguintes pré-requisitos instalados:
* Docker
* Docker Compose

## Iniciando a Aplicação
Para iniciar a aplicação, você deve usar o Docker Compose. Siga os passos abaixo:

1. Clone o repositório

``` bash
git clone https://github.com/celiopiresj/SmartMeter.git smartmeter
cd smartmeter
```

2. Configure o ambiente

Certifique-se de que os arquivos de configuração necessários estão presentes e configurados corretamente. Isso pode incluir variáveis de ambiente e arquivos de configuração específicos para o seu ambiente.

* Crie um arquivo .env (se ainda não existir) na raiz do projeto. Este arquivo deve incluir a variável GEMINI_API_KEY. Aqui está um exemplo de como o arquivo .env pode ser configurado:

``` dotenv
GEMINI_API_KEY=your_gemini_api_key_here
```

3. Inicie a aplicação

Execute o comando abaixo para iniciar os containers Docker definidos no docker-compose.yml:

```bash
docker-compose up
```
## Acesse a aplicação

A aplicação estará disponível em http://localhost:8080.

# Endpoints da API
Aqui estão os principais endpoints disponíveis na API:

## Upload de Imagem
  - Endpoint: **/upload**
  - Método: **POST**
  - Descrição: **Envia uma imagem para processamento.**

Request Body:
```json
{
  "image": "base64",
  "customer_code": "string",
  "measure_datetime": "datetime",
  "measure_type": "string"
}
```

  * image: **Imagem codificada em base64.**
  * customer_code: **Código do cliente.**
  * measure_datetime: **Data e hora da medição no formato ISO 8601.**
  * measure_type: **Tipo de medição, que pode ser "WATER" ou "GAS".**

## Listar Leituras de um Cliente

  - Endpoint: **/customer_code/list**
  - Método: **GET**
  - Descrição: **Obtém a lista de leituras de medidores para um cliente específico.**
  - Parâmetro de URL: **customer_code - Código do cliente para o qual as leituras devem ser retornadas.**
  - **Parâmetros de URL:**
    - `customer_code` (string) - Código do cliente para o qual as leituras devem ser retornadas.

  - **Parâmetros de Query (opcionais):**
    - `measure_type` (string) - Tipo de medição a ser filtrado. Pode ser `"WATER"` ou `"GAS"`. A validação é feita de forma case insensitive. Se o parâmetro for informado, a resposta incluirá apenas as leituras que correspondem ao tipo de medição especificado.

  - **Exemplo de Requisição:**

    ```http
    GET /12345/list?measure_type=water
    ```

## Confirmar Leitura

  - Endpoint: /confirm
  - Método: PUT
  - Descrição: Confirma a leitura de um medidor.


```json
{
  "measure_uuid": "string",
  "confirmed_value": "integer"
}
```
  * measure_uuid: **UUID da medição a ser confirmada.**
  * confirmed_value: **Valor confirmado da medição.**
