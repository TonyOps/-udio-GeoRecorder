A aplicação "Áudio Geo Recorder" permite gravar o áudio automaticamente quando se está dentro de uma determinada distância de um local predefinido.

Utilizando dados de geolocalização, o aplicativo monitora a localização do usuário em tempo real e inicia a gravação de áudio quando ele se aproxima do local definido.

Quando o usuário se afasta além da distância especificada, a gravação é automaticamente interrompida.

Todos os áudios gravados são armazenados em um banco de dados MongoDB, garantindo a preservação das informações capturadas e a possibilidade de acesso posterior.

Instalação:

    Certifique-se de ter o Node.js instalado em seu sistema. Você pode baixá-lo em nodejs.org.

    Crie um novo diretório para o seu projeto e navegue até ele no terminal.

    Inicie um novo projeto Node.js executando o seguinte comando:
    

npm init -y

Instale as dependências necessárias executando o seguinte comando:


    npm install express geolib node-record-lpcm16 mongodb

Configuração:

    No arquivo server.js, defina as coordenadas do local de interesse na variável localInteresse. Por exemplo:


const localInteresse = { latitude: SUA_LATITUDE, longitude: SUA_LONGITUDE };

Configure as opções de gravação de áudio no objeto audioOptions de acordo com suas preferências. Por exemplo:


const audioOptions = {
  sampleRate: 16000,
  channels: 1,
  verbose: false,
};

Certifique-se de ter um servidor MongoDB em execução. Você pode instalar o MongoDB a partir do site oficial mongodb.com.

No arquivo server.js, altere a variável mongoURI para a URL de conexão com seu banco de dados MongoDB. Por exemplo:


    const mongoURI = 'mongodb://localhost:12345/seu_banco_de_dados';

Execução:

    No terminal, dentro do diretório do seu projeto, inicie o servidor Node.js executando o seguinte comando:

node server.js

O servidor será iniciado e estará pronto para receber solicitações.

Observação: É adequado optar pela gravação de áudio no formato "ogg" para minimizar o consumo de dados, além de implementar uma política de exclusão dos áudios quando não forem mais necessários.

