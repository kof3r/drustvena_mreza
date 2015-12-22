LOKALNA INSTALACIJA (za development granu - update 2.12.2015: 5. i 6. korak!):

1. preuzeti i instalirati Node.js
    preporučeno msi installer za Windowse
    (https://nodejs.org/en/download/)
    
2. preuzeti i instalirati MySQL server i Workbench
    preporučano preko web installera, odabrati samo dvije gore spomenute komponente (ostale nam nisu potrebne)
    (https://dev.mysql.com/downloads/installer/, tj. https://dev.mysql.com/downloads/file/?id=459895)
    
3. U workbenchu izvršiti SQL kôd iz datoteke sql.sql kako bi se formirala početna baza s tablicama naziva drustvena_mreza

4. [NOVO!] preuzeti i instalirati Graphics Magick s http://www.graphicsmagick.org/

5. Provjeriti odgovara li port MySQL servera onome u config/db.js, ako ne, promijeniti taj parametar

6. U public/javascripts/mail.js dodati svoj gmail username i pass

7. U direktoriju gdje je smješten repozitorij otvoriti Command Prompt / Terminal i naredbom "node bin/www.js" pokrenuti

8. U web pregledniku upisati "localhost:8080/"