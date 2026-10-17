# Pubblicazione Cloudflare

Il Worker serve https://wordchain.giacomel.info/. I push su main attivano i test GitHub e il deploy Git nativo Cloudflare,
il cui controllo Workers Builds è tornato success dopo la ricreazione.
Il workflow riutilizzabile di AgentPippo è un percorso di recupero manuale, fissato alla versione indicata in .github/workflows/ci.yml.
Il repository possiede il proprio secret cifrato CLOUDFLARE_API_TOKEN, installato
tramite ciphertext per la chiave pubblica GitHub del destinatario. Il token in
chiaro non è stato esportato dal runner sorgente.

Il workflow pubblica il commit esatto collaudato, conserva la versione precedente,
verifica via API autenticata che sia attivo il tag del commit collaudato. In caso
di errore di deployment ripristina la versione precedente, quando esiste.
La verifica pubblica di SHA256 e gameplay viene eseguita separatamente da una
postazione che accede al sito e registrata sul commit. Il probe pubblico del
runner è opzionale: le protezioni Cloudflare possono impedirgli l’accesso.

I due vecchi Worker sono stati cancellati manualmente dal proprietario e ricreati
con gli stessi nomi e domini. La nuova distribuzione passa da GitHub Actions;
non dipende dal vecchio token Workers Builds e non configura un collegamento
Git diretto nel pannello Cloudflare. Le versioni dei Worker cancellati non
sono recuperabili attraverso il nuovo Worker.

Artifact per ogni esecuzione: ricevute prima/dopo, confronto HTTP e screenshot.
Lo script di sicurezza Cloudflare può modificare l’HTML; resta attivo. I bundle
applicativi devono corrispondere esattamente alla build e il gameplay deve passare.

Per evitare deploy concorrenti, il job GitHub publish parte solo da
workflow_dispatch su main. I normali push lasciano la pubblicazione al
collegamento Git di Cloudflare, verificando separatamente entrambi i controlli.
