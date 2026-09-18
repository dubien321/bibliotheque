async function chargerComponent(chemin, element_id){
    try {
        const reponse = await fetch(chemin);
        if(!reponse.ok) throw new Error(`Impossible de charger ${chemin}`);
        const html = await reponse.text();
        const element = document.getElementById(element_id);
        if(element){
            element.innerHTML = html;
            console.log('composant chargé')
        }
    } catch (error) {
        console.error(`Erreur de chargement ${chemin}`, error)
    }
}

function surlignerLienActif(){
    const chemin = window.location.pathname;
    const pageName = chemin.split('/').pop().replace('.html','') ||'dashboard';

    const liens = document.querySelectorAll('.sidebar-nav a[data-page]');
    liens.forEach(lien =>{
        if(lien.dataset.page ===pageName){
            lien.classList.add('active');
        }
        else{
            lien.classList.remove('active')
        }
    })
}
function activerMenuMobile(){
    const toogle = document.getElementById('menuToogle');
    const sidebar = document.getElementById('sidebar');

    if(toogle && sidebar){
        toogle.addEventListener('click', ()=>{
            sidebar.classList.toggle('open');
        })
    }
}

async function initialiserLayout(){
    await Promise.all([
        chargerComponent('/components/header.html', 'header-container'),
        chargerComponent('/components/sidebar.html', 'sidebar-container'),
        chargerComponent('/components/footer.html', 'footer-container'),
    ]);
    surlignerLienActif();
    activerMenuMobile();
}
document.addEventListener('DOMContentLoaded', initialiserLayout);