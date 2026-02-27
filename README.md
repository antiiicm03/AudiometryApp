Audiometry App — Android aplikacija za testiranje sluha 

Ova aplikacija je razvijena u React Native + Kotlin i služi za testiranje sluha generisanjem sinusoida u realnom vremenu. Projekat je realizovan samostalno i pokazuje razumevanje audio DSP, real-time sistema i native modula u React Native-u.

Funkcionalnosti:

-Ručno generisanje 16-bit PCM sinusoida i streamovanje preko AudioTrack API-ja
-Podešavanje sample rate-a (44.1 kHz) i veličine buffera radi sprečavanja audio artefakata
-Dinamičko menjanje frekvencije (125–8000 Hz) preračunavanjem perioda talasa
-Mapiranje amplitude na simulirane dB HL vrednosti intenziteta
-Nezavisna kontrola levog i desnog kanala
-Dva režima reprodukcije: kontinuirani i pulsni, sa izmenom parametara u realnom vremenu
-Native Module most između Kotlin i JavaScript sloja koristeći asinhrone Promise pozive

Tehnologije:

-React Native (Expo + Bare Workflow)
-Kotlin / JavaScript
-AudioTrack API
-TypeScript
