import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();


const app = express();

app.use(cors());

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

app.get('/perguntaUsuario', async (req, res) => {


    async function respostaGerada(pergunta){

    const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Responda a seguinte pergunta de uma forma simples, rápida e direta, sem estendê-la para mais do que 1 parágrafo extremamente curto, evitando textos. Certifique-se de que a pergunta é totalmente relacionada sobre comércio exterior ou matemática e, caso não tenha, informe que não é possível responder por estar fora de seu conhecimento. Certifique-se também que a pergunta se enquadra nos direitos humanos, além de estar em português a todo momento, exceto se o usuário exigir que seja em outra linguagem. Aqui está a pergunta: ${pergunta}`,
    
        });

    let resposta_ai = response.text;
    return resposta_ai;

    }

    res.send(await respostaGerada(req.query.pergunta));

    
}
)


app.listen(3000);