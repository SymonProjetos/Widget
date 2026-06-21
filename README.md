# Cruzeiro Widget

Um widget de área de trabalho construído com [Electron](https://www.electronjs.org/) para exibir os próximos jogos do Cruzeiro Esporte Clube e o status da venda de ingressos.

## 🌟 Funcionalidades

- **Próximos Jogos**: Exibe os próximos 10 jogos do Cruzeiro com informações detalhadas (adversário, data, campeonato, etc.).
- **Status de Ingressos**: Mostra a disponibilidade de ingressos para os próximos jogos (informação extraída diretamente do site [Sócio 5 Estrelas](https://socio.cruzeiro.com.br/)).
- **Widget Discreto**: Janela transparente, sem bordas, que se integra perfeitamente à área de trabalho.
- **Auto-Inicialização**: Configurado para iniciar automaticamente ao fazer login no sistema (quando empacotado).
- **Atualização Automática**: Os dados de jogos e ingressos são atualizados automaticamente a cada 6 horas.

## 🛠️ Tecnologias Utilizadas

- **[Electron](https://www.electronjs.org/)**: Framework para construção de aplicativos desktop.
- **[Node.js](https://nodejs.org/)**: Ambiente de execução.
- **[Axios](https://axios-http.com/) & [Cheerio](https://cheerio.js.org/)**: Para realizar web scraping dos dados dos jogos e ingressos.
- **HTML/CSS/JS Vanilla**: Para a interface e renderização do widget.

## 🚀 Como Executar o Projeto

### Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/) e o [npm](https://www.npmjs.com/) instalados na sua máquina.

### Passos para instalação e execução local

1. Clone ou baixe este repositório.
2. Acesse a pasta do projeto via terminal.
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Execute o aplicativo:
   ```bash
   npm start
   ```

### Gerando o executável (Build)

Para criar um instalador/executável do widget para o Windows, execute o comando:

```bash
npm run build
```

O instalador será gerado na pasta `dist/` (com base na configuração do `electron-builder`).

### Alternativa (Caso a Build falhe no Windows)

Devido a políticas de segurança do Windows (Windows Defender/SmartScreen) com executáveis não assinados digitalmente gerados pelo `electron-builder`, o `.exe` gerado pode sofrer um "crash" e fechar imediatamente na inicialização (erro `STATUS_BREAKPOINT`). Caso isso ocorra, você pode usar a alternativa silenciosa via script VBScript.

**Para iniciar silenciosamente usando o código-fonte:**
Dê dois cliques no arquivo `start-widget.vbs` localizado na raiz do projeto. O widget abrirá perfeitamente sem mostrar nenhuma janela preta de terminal (cmd).

**Para configurar o widget na inicialização do Windows automaticamente:**
1. Clique com o botão direito no arquivo `start-widget.vbs` e selecione **"Criar atalho"**.
2. Aperte as teclas `Win + R` no seu teclado, digite `shell:startup` e pressione Enter.
3. Mova o atalho criado (do passo 1) para dentro dessa pasta que foi aberta. Pronto! O widget iniciará de forma totalmente invisível sempre que o seu PC ligar.

## 📁 Estrutura do Projeto

- `src/main.js`: Arquivo principal do processo do Electron, gerencia o ciclo de vida da janela e agendamento de atualizações.
- `src/index.html` & `src/index.css`: Estrutura e estilo da interface do widget.
- `src/preload.js`: Ponte segura entre o processo principal e o de renderização.
- `src/scraper-jogos.js` & `src/scraper-ingressos.js`: Scripts responsáveis por buscar os dados na web (web scraping).
- `src/renderer-jogos.js` & `src/renderer-ingressos.js`: Scripts responsáveis por atualizar o DOM com os dados buscados.
- `package.json`: Configurações de dependências e scripts de build.
