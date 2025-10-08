# Odontologia
Projeto Semestral para Fatec Zona Leste. Técnologias usadas nesse projeto, Node Js, Postgresql, Docker

Para iniciar o projeto primeiro confira o arquivo .env.exemple e monte seu banco depois é só rodar o comando 

"docker compose up -d"

isso sobe todos os container e imagens e para derrubar tudo rode:

"docker compose down"

todas as modificações que for feita localhost, não reflete no docker ou seja precisa empurrar as alterações
do seu localhost para o container docker, sempre usar o comando a seguir para que as modificações sejam de fato 
concretizada.

"docker compose build" e depois "docker compose up -d"

os logs do sistema não irá mais sair no terminal do VSCODE é necessario entrar no containner do app e checar o logs
 a mesma coisa para o banco deve entrar no container do banco, por linha de comando fica mais fácil 

exemplo de como ver o log: docker logs clinicaOdontologica-app
exemplo de como entrar no banco :  docker exec -it clinicaOdontologica-db psql -U postgres -d OdontologiaLegal

A migration representa a tabela do banco de dados quando a gente cria uma migration um arquivo é gerado nele 
é só colocar os dados da tabela, por exemplo: 
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      continua conforme a necessidade da entidade.

Para criar uma migration: npx sequelize-cli migration:generate --name aqui_o_nome_da_migration
Para rodar a migration precisa entrar no container do app e ai sim rodar migration, isso fará com que a tabela seja criada no banco automaticamente.

o comando é: docker exec -it clinicaOdontologica-app npx sequelize-cli db:migrate

O nome clinicaOdontologica-app é o nome do container 
confira o nome do container com o comando:

docker ps

dentro do banco rode 
\dt
para mostrar todas as tabelas do banco.

se quiser conferir todas as coluna e especificações de alguma tabela especifica faça 

\d users

para rodas comando basta usar sql 

SELECT * FROM users;