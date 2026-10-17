# Pubblicazione Cloudflare

Sito: https://wordchain.giacomel.info/. I vecchi Worker sono stati cancellati manualmente
dal proprietario; i report before.json confermano l’assenza della distribuzione
prima del ripristino. Nomi e domini canonici sono stati ricreati.

## Flusso ordinario

Ogni push su main esegue i test GitHub, poi il job publish chiama il workflow
riutilizzabile di AgentPippo fissato nella CI. Il commit esatto collaudato viene
pubblicato tramite Wrangler. È disponibile anche workflow_dispatch su main.

Il secret CLOUDFLARE_API_TOKEN è locale a questo repository ed è stato
installato tramite ciphertext destinato alla sua chiave pubblica GitHub: il
valore in chiaro non è stato esportato dal runner sorgente.

Il gate automatico richiede build, integrità, migrazioni e gameplay in Chrome
prima del deploy. Salva la versione precedente e verifica via API autenticata
che la versione attiva sia taggata con il commit atteso. Un fallimento della
verifica della distribuzione ripristina la versione precedente, quando esiste.
Le versioni dei Worker cancellati non sono recuperabili.

## Verifica pubblica

Il test separato esegue checksum SHA256 dei bundle JS/CSS e gameplay reale sul
dominio pubblico; il risultato da postazione è registrato sul commit. Il
probe pubblico nei runner è opzionale, perché le protezioni Cloudflare possono
bloccarli. La pagina di login su workers.dev non è considerata il gioco.
Lo script di sicurezza aggiunto da Cloudflare all’HTML resta attivo.

Artifact del deploy: ricevute prima/dopo e confronto delle sonde HTTP. Il
controllo Cloudflare Workers Builds che accompagna una pubblicazione non è
considerato prova di un collegamento Git diretto: il percorso automatico
configurato e verificato è GitHub Actions.
