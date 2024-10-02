import * as vscode from 'vscode';
import axios from 'axios';

// Replace this with your OpenAI API key
const OPENAI_API_KEY = 'sk-jyFVvpMM0O6ZlsmLetrB1uMD9um0hZeEAHBg6Kj2h8T3BlbkFJIimPZ_4Pc5ImeVkrdcGBzup70-Mmcy8hk5DTYnLt4A';

export function activate(context: vscode.ExtensionContext) {
    console.log('OpenAI Code Suggestion Extension is now active!');

    let disposable = vscode.commands.registerCommand('extension.openaiCodeSuggestion', async () => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showInformationMessage('OpenAI Code Suggestion: No active editor found.');
            return;
        }

        const document = editor.document;
        const selection = editor.selection;
        const selectedText = document.getText(selection) || "What is the best way to implement this code?";

        // Get the response from OpenAI
        const response = await getOpenAICompletion(selectedText);

        if (response) {
            // Show the response in a new editor
            editor.edit(editBuilder => {
                editBuilder.replace(selection, response);
            });
        }
    });

    context.subscriptions.push(disposable);
}

async function getOpenAICompletion(prompt: string): Promise<string | undefined> {
    try {
        const response = await axios.post('https://api.openai.com/v1/completions', {
            model: "text-davinci-003", // Choose the OpenAI model
            prompt: prompt,
            max_tokens: 100,
            n: 1,
            stop: null,
            temperature: 0.7
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        });

        const completion = response.data.choices[0].text;
        return completion.trim();
    } catch (error) {
        vscode.window.showErrorMessage('Error fetching OpenAI suggestion: ');
        return undefined;
    }
}

export function deactivate() {}
