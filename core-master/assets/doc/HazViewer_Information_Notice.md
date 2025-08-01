# Information about HazViewer

### *!!! PLEASE READ THIS TEXT CAREFULLY BEFORE USING HAZVIEWER !!!*

<br>

# HazViewer 

is an ***online GIS application designed to explore databases of natural hazard events*** created by the AfricaMuseum and Vrije Universiteit Brussel (Belgium). It supports data display, filtering, style customization, and the generation of simple maps. HazViewer integrates two data sources: HazMiner database, which is created with HazMiner, a tool developed to extract information through text mining from news articles, and Citizen Observer (CO) data, which correspond to events reported by networks of citizen observers in Central Africa. HazViewer mainly provides information on floods, landslides, and flash floods, but CO data include additional information about earthquakes, hailstorms, lightning strikes, and windstorms. HazMiner offers global coverage, while CO data focuses on North and South Kivu in the Democratic Republic of the Congo (DRC). Clicking on an event reveals detailed insights, including maps and time series visualizations.      

<br>

## How to use HazViewer

HazViewer is an intuitive web interface allowing you to visualise and analyse hazard events interactively, like you would be able to do in a GIS software. Series of options exist to display, filter, and download (only for HazViewer) the data. For detailed information, a [userguide](assets/doc/user_guide.pdf) and << tutorials >> are available.

<br>

## Authorship and Management

**The original version of HazViewer was developed by:**
- Maïlys Pelissier – Ecole Nationale des Sciences Geographiques (France)

<u>Under the supervision of</u>:
- François Kervyn – Royal Museum for Central Africa (Belgium)
- Benoît Smets – Royal Museum for Central Africa (Belgium) / Vrije Universiteit Brussel (Belgium)
- Bram Valkenborg – Vrije Universiteit Brussel (Belgium)

**The natural hazard databases feeding HazViewer are managed by:**
- [HazViewer] – Bram Valkenborg – Vrije Universiteit Brussel (Belgium)
- [Citizen Observations] – Caroline Michellier – Royal Museum for Central Africa (Belgium) / Université Catholique de Louvain (Belgium)

**The online maintenance of HazViewer is performed by:**
- Frank Theeten - Royal Museum for Central Africa (Belgium)

**The general management of HazViewer is performed by:**
- Benoît Smets – Royal Museum for Central Africa (Belgium) / Vrije Universiteit Brussel (Belgium)
- François Kervyn – Royal Museum for Central Africa (Belgium)

<br>

## Databases

**(1) HazMiner**

The main global database of impactful hazard events available in HazViewer has been created using ***HazMiner*** *(Valkenborg et al. 2026a, 2026b)*, a multilingual tool that uses natural language processing techniques to extract information on geo-hydrological hazards (i.e., ***floods, landslides, and flash floods***) from online news articles. The source articles are retrieved from GDELT (Global Database of Events, Language, and Tone; source: [GDELT Project](https://www.gdeltproject.org/)), a global database monitoring events through online news articles.

**(2) Kivu citizen Observer Network**

To be completed by Caroline

Since 2019, networks of citizen observers (CO) has been developed in North and South Kivu, (D.R.Congo). CO networks are managed by the local divisions of the Congolese Civil Protection. These networks have been developed in the frame of the [HARISSA project](https://georiska.africamuseum.be/en/activities/harissa) (2019-2029), funded by the [Belgian Development Cooperation](https://diplomatie.belgium.be/en/dgd).   

CO are surveying natural hazards and associated disasters, using smartphones or tablets. They collect information on ***earthquake, flood, hailstorm, landslide, lightning, and windstorm***. The collected data (description, pictures, location of hazards and potential damages) are then transmitted to an online platform and analysed by Congolese CO supervisors who produce regular reports presenting the natural hazards and associated disasters situation in their region. Beyond observing, CO are key actors in their local communities; they are in direct contact with the environment and play a role in awareness raising at the interface between communities and scientists.   

Through HazViewer, we provide visualisation of these CO data for Kivu, and the possibility to analyse them using a series of filters and display options.

<br>

## Legal notice

**HazMiner – web scraping and text mining in press articles**

The ***HazMiner database*** has been created through lawful text and data mining in accordance with Article 3 of Directive (EU) 2019/790 on copyright and related rights in the Digital Single Market. All information contained in this database results from automated extraction and synthesis of lawfully accessible sources, including publicly available news articles indexed in the GDELT database. The dataset includes only factual information (e.g., time, location, event type, reported impacts) and does not reproduce any protected expression or copyrighted content from the original sources.

The HazMiner database is publicly available and free to use via the HazViewer platform. Users are permitted to download and use the data for personal, academic, or non-commercial purposes, provided that appropriate attribution is given (see the Citation section for details).

***Important Notice:*** The HazMiner database is generated automatically from press articles. Due to the volume of articles processed, individual verification of each recorded event is not systematically performed. As such, the dataset may contain false positives, duplicates, or incomplete information. Users should take these limitations into account when using the data.

The Royal Museum for Central Africa and the Vrije Universiteit Brussel, as well as their affiliated researchers, accept no liability for any misuse of the HazMiner data or for any misinterpretations arising from its use.


**Citizen Observer data**

To be completed by Caroline

<br>

## Citation

To cite HazViewer, please use the following two references:
- Pelissier M., Valkenborg B., Smets B., Kervyn F. (2025) – HazViewer: Interactive webGIS to analyse geohazard events extracted from HazMiner or coming from Citizen Observers. https://github.com/GeoRiskA/HazViewer. DOI: tbd.
- Smets B., Pelissier M., Valkenborg B., Michellier C., Dewitte O., Kervyn F. (2026) – HazViewer, an interactive webGIS to analyse natural hazards event databases of the AfricaMuseum. In preparation...

To cite HazMiner, please use the following two references:
- Valkenborg B., Dewitte O., Michellier C. Kervyn F., Smets B. (2026a) – 
- Valkenborg B., Smets B. (2026b) – pyHazMiner, the python module of HazMiner, to automatically extract impactful geohazard events from press articles. In preparation ...

To cite the citizen observer database, please use the following reference:
- Michellier C., ...

<br>

------
*(c) Royal Museum for Central Africa / Vrije Universiteit Brussel, 2025*  