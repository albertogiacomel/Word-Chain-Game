# Pubblicazione Cloudflare

Sito: https://wordchain.giacomel.info/. Dopo la cancellazione manuale dei vecchi Worker
sono stati ripristinati i nomi e i domini canonici. I controlli nativi
Workers Builds sono tornati success.

## Flusso ordinario

I push su main avviano i test GitHub e la pubblicazione Git nativa Cloudflare.
Verificare separatamente entrambi i controlli: la riuscita dei test GitHub
non dimostra da sola che Cloudflare abbia pubblicato.

## Recupero manuale

Il job GitHub publish parte soltanto con workflow_dispatch su main. Usa il
workflow riutilizzabile di AgentPippo fissato nella CI, con il commit esatto
del gioco e il secret locale CLOUDFLARE_API_TOKEN. Il secret è stato installato
tramite ciphertext destinato alla chiave pubblica GitHub del repository: il
valore in chiaro non è stato esportato dal runner sorgente.

Il recupero salva la versione precedente, pubblica la build collaudata e
verifica tramite API autenticata che sia attivo il tag del commit atteso.
Un errore della verifica della distribuzione ripristina la versione precedente,
quando disponibile. Le versioni dei Worker cancellati non sono recuperabili.

## Verifica pubblica

Il test separato esegue checksum SHA256 dei bundle JS/CSS e gameplay reale sul
dominio pubblico; il risultato da postazione è registrato sul commit. Il
probe pubblico nei runner è opzionale, perché le protezioni Cloudflare possono
bloccarli. La pagina di login su workers.dev non è considerata il gioco.
Lo script di sicurezza aggiunto da Cloudflare all’HTML resta attivo.

Artifact del recupero: ricevute prima/dopo, confronto delle sonde HTTP e
verifica live quando richiesta. Non si confondono risposte HTTP di sicurezza
con misure delle prestazioni del gioco. Non sono attivi due deploy automatici
concorrenti: Cloudflare pubblica normalmente, GitHub conserva il recupero.
