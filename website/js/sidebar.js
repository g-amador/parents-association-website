let sidebarVisible = true;

function toggleSidebar() {    
	const header = document.querySelector('.header');
    const content = document.querySelector('.content');
	const sidebar = document.getElementById('sidebar');
    const sidebarTexts = document.querySelectorAll('.sidebar-text');

    if (sidebarVisible) {
        header.classList.add('sidebar-closed');
		content.style.marginLeft = '0'; // Adjust margin when sidebar is hidden
		sidebar.style.width = '35px';
        sidebarTexts.forEach(text => {
            text.style.display = 'none';
        });
    } else {
		header.classList.remove('sidebar-closed');
		content.style.marginLeft = '200px';
        sidebar.style.width = '200px';
        sidebarTexts.forEach(text => {
            text.style.display = 'inline-block';
        });
    }

    sidebarVisible = !sidebarVisible;
}

function changeColor(event, selected) {
    const links = document.querySelectorAll('.sidebar a');
    links.forEach(link => {
        link.style.color = 'black';
    });

    const selectedLink = event.currentTarget;
    selectedLink.style.color = 'blue';
}
