## Requisitos para dummies

Para compilar o arquivo do rotacionador (vsat-audce-rot-v3.pd), é necessário:

- clonar o código completo do AUDIENCE (conteúdo do repositório "audience" no github, que inclui /src e todo os patches .pd) 
- instalar a versão atual do Pd4Web (disponível em: https://charlesneimog.github.io/pd4web/)

Instalação do pd4web pode ser feita via comando "pip": "pip install --pre pd4web"
Para acesso aos arquivos do AUDIENCE, requer acesso ao repositório principal (privado). Com 

## Para compilar o arquivo vsat-audce-rot-v3.pd:
 
- Nessa pasta atual ("puredata") disparar o comando: "pd4web init.pd" (isto vai criar uma pasta "Pd4Web" e outras dentro)
- Na pasta criada "Pd4Web/Externals" adicionar o conteúdo do repositório do AUDIENCE, isto pode ser feito de 2 maneiras:
	- você tem já tem o repositório /audience clonado em uma pasta chamada "audience" --> copie esta pasta para dentro da pasta "Pd4Web/Externals"
 	- se você não tem o repositório /audience ainda, com o comando "git clone https://github.com/LATM-USP/audience" crie a pasta "audience" dentro da pasta "Pd4Web/Externals/audience"  
- Criar uma pasta "...puredata/Libs" que contenha os patches chamados no patch de aplicação "vsat-audce-rot-v3, isto é, os patches .pd da distribuição do AUDIENCE, que ora estão na pasta "audience/audce"
- Na pasta "puredata" disparar o comando: "pd4web vsat-audce-rot-v3.pd -m 512 --nogui" (isto vai criar a pasta "WebPatch" que contém os arquivos produtos: arquivos .js

## Para usar

- DESCREVER O ROTEIRO DE USO A PARTIR DE UMA ESTÓRIA NA WEB
- CONSIDERANDO REDE LOCAL, DESCREVA O ROTEIRO DE USO


