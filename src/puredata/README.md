Para compilar o arquivo do rotacionador (vsat-audce-rot-v3.pd), é necessário o acesso ao código fonte do AUDIENCE, e á versão atual do Pd4Web (disponível em: https://charlesneimog.github.io/pd4web/).

Para acesso aos arquivos do AUDIENCE, entre em contato com alguém responsável pelo repositório.

Para compilar o arquivo vsat-audce-rot-v3.pd:
    - Adicionar a pasta do AUDIENCE "Libs" no diretório puredata;
    - Usar nesse repositório o comando: pd4web vsat-audce-rot-v3.pd -m 512 --nogui 
    - Na pasta criada Pd4Web, em Externals, adicionar o AUDIENCE;
    - Usar novamente nesse repositório o comando: pd4web vsat-audce-rot-v3.pd -m 512 --nogui