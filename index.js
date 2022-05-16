const express = require('express')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const app = express()

const token = '';
const basicAuth = '';
const baseUrl = 'https://api.us-south.assistant.watson.cloud.ibm.com/instances/bb587891-2ef1-4355-95bb-e1d61ee02cf0';

app.use(express.json())

app.get('/auth', (req, res) => {
    if(req.body.user === 'vivicruz@email.com' && req.body.password === '123'){ // verificação de dado para criaçãp de token
        const token = jwt.sign({
            userId: 1,
            role: 'admin'
        }, 'mysecretkey', { // Nome do token
            expiresIn: '5m' // Tempo de validade do token
        })
        return res.status(200).json({token})
    } else {
        return res.status(401).json({ 'response': 'Não autenticado' })
    }
})

app.post('/watsonConnection',async (req, res) => {

    try{
        const [ _, tokenJW] = req.headers.authorization.split(' ') // Pega o token do Bearer
        jwt.verify(tokenJW, 'mysecretkey') // Aqui faz a verificação do token recebido com o criado

        // A chamada do Watson acontece caso o token esteja certo
        const request = {
            method: 'get',
            url: `${baseUrl}/v1/workspaces/0d0e3f47-5e7f-4c86-b88c-4e61383b4401/entities/data/values/janeiro/synonyms?version=2021-11-27`,
            headers: { 
                'Accept': '/', 
                'Authorization': `Basic ${basicAuth}`,
                'Content-Type': 'application/json'
            },
            auth: {
                username: 'apikey',
                password: token
            }
        }

        const resposta = await axios(request)

        return res.status(200).json({ 'response': resposta.data })
    } catch (err) {
        // Caso tenha erro de token errado ou algum na api, vai cair aqui
        console.log(err)
        if(err.message == 'jwt expired'){
            return res.status(401).json({ 'response': 'token invalido' })
        } else {
            return res.status(500).json({ 'erro': 'erro' })
        }
    }
})

app.listen(3000, () => { console.log('Listening on port 3000...')})