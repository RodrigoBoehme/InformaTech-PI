<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&height=100&color=7ED957"/>

<div align="center">

<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&pause=1000&color=7ED957&center=true&width=435&lines=Ol%C3%A1%2C+n%C3%B3s+somos+a+InformaTech" alt="Typing SVG" />
</a>

</div>


```md
|              Nome              | Idade |    Cargo    |
|--------------------------------|-------|-------------|
| Éverton Eduardo Rodrigues Reis |  1 7  |  FullStack  |
| João Pedro                     |  1 9  |  FullStack  |
| Rian Andre Santos Cabral       |  2 3  |  vice-líder |
| Rodrigo Boehme                 |  2 3  |  Líder      |
```
---

<h3 align="center">Descrição do Projeto</h3>

<p align="center">
  

```md
>  Nosso projeto busca auxiliar no caso de problemas com enchentes na região da cidade de São Leopoldo, Rio Grande do Sul.
O projeto ultiliza dados de casos anteriores para auxiliar, definir zonas de risco e pontos seguros.
```

---
##  Banco de Dados

<details>
<summary>Clique para abrir</summary>

<img src="https://github.com/RodrigoBoehme/InformaTech-PI/blob/main/IMAGENS/ImgBancoDeDados.png">

</details>



---



## 🛠️ Software Metologia Agil

Link: [TRELLO](https://trello.com/invite/b/69b1f4309af483167f370135/ATTIb7651731b91ac09f22e4b0cb7d59e103882A0C66/resgatech)

---

## 🧑🏻‍🏫 Primeira Banca de Apresentação

[Apresentação](https://www.canva.com/design/DAGZ07xiAhw/WQPustfPXW6BpEaH1Ip4UQ/view?utm_content=DAGZ07xiAhw&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h2a30923b01)

---

## 📚 Artigos e Documentos

[OverLeaf](https://www.overleaf.com/read/bgqcjmdmvmhm#705f8c)

[Documentação do Projeto](https://docs.google.com/document/d/1l-mksFd1MLT9Tp9tfvOTlnNB7cVMcfGWuMv-su7gLb0/edit?usp=sharing)

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=7ED957&height=100&section=footer"/>
<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&height=100&color=7ED957"/>

# InformaTech Full Stack

Projeto com aplicativo React Native/Expo e API Node.js.

## Backend intermediário e didático

Tecnologias principais: TypeScript, Express, TypeORM, MySQL, JWT, bcrypt, Zod e
Swagger. A arquitetura possui controllers, services e repositories reais.

**Não utiliza migrations:** o TypeORM cria as tabelas automaticamente com
`synchronize: true`. Consulte `backend/README-BACKEND.md` para executar.

## Pastas

- `backend`: API REST e documentação Swagger.
- `mobile`: aplicativo React Native com Expo Router.


## Melhorias da versão 1.1
- CRUD de zonas de risco circulares persistidas no MySQL.
- Nível de inundação: baixo, moderado, alto ou crítico.
- Criação de círculo por clique, arraste e soltura no mapa.
- Somente ADMIN pode criar, editar ou excluir zonas.
- Todos os usuários autenticados podem visualizar as zonas.
- Campos de senha com botão para mostrar/ocultar.
- Validação de e-mail no app e no backend com Zod.
- Splash screen configurada com imagem.
- TypeORM com `synchronize: true`, sem migrations.

## Criar o administrador
No backend, revise os campos `ADMIN_*` do arquivo `.env` e execute:
```bash
npm run create-admin
```
Depois entre no aplicativo com o e-mail e a senha definidos. Troque a senha padrão antes de publicar.

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=7ED957&height=100&section=footer"/>
