# Pubblicazione Cloudflare

Il Worker serve https://wordchain.giacomel.info/. I push su main eseguono prima i test
e poi il workflow riutilizzabile di AgentPippo, fissato alla versione indicata in .github/workflows/ci.yml.
Il repository possiede il proprio secret cifrato CLOUDFLARE_API_TOKEN, installato
tramite ciphertext per la chiave pubblica GitHub del destinatario. Il token in
chiaro non è stato esportato dal runner sorgente.

Il workflow pubblica il commit esatto collaudato, conserva la versione precedente,
verifica SHA256 dei bundle JS/CSS e gameplay reale sul dominio pubblico. In caso
di fallimento live ripristina la versione precedente, quando esiste.

I due vecchi Worker sono stati cancellati manualmente dal proprietario e ricreati
con gli stessi nomi e domini. La nuova distribuzione passa da GitHub Actions;
non dipende dal vecchio token Workers Builds e non configura un collegamento
Git diretto nel pannello Cloudflare. Le versioni dei Worker cancellati non
sono recuperabili attraverso il nuovo Worker.

Artifact per ogni esecuzione: ricevute prima/dopo, confronto HTTP e screenshot.
Lo script di sicurezza Cloudflare può modificare l’HTML; resta attivo. I bundle
applicativi devono corrispondere esattamente alla build e il gameplay deve passare.
