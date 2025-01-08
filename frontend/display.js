import * as fetch from "./fetch.js";


export async function populateUserProfile(container){
    const user = await fetch.getUser();

    console.log(user)

    container.innerHTML = '';

    container.innerHTML =  `
                <div class="logo">
                    <img src="../img/nopictures.jpg" alt="Profile Logo">
                    <h2>Name</h2>
                    <p class="user-name">${user.username}</p>
                    <h2>email </h2>
                    <p id="user-email">${user.email}</p>
                    <h2>Description</h2>
                    <p id="user-description">${user.description ? user.description : 'N/A'}</p>
                </div>
                `;

    return user.username
}


export async function populateUserInfo(container){
    const user = await fetch.getUser();

    container.innerHTML = '';

    container.innerHTML =  `
                <div class="logo">
                    <h2>Name</h2>
                    <p class="user-name">${user.username}</p>
                    <h2>email</h2>
                    <p id="user-email">${user.email}</p>
                    <h2>Description</h2>
                    <p id="user-description">${user.description ? user.description : 'N/A'}</p>
                </div>
                `;

    /*
    const editUsernameButton = document.getElementById('editUsername');
    const editEmailButton =document.getElementById('editEmail');
    const editDescriptionButton = document.getElementById('editDescription');

    editUsernameButton.addEventListener('click', async function() {
        const body = {
            username: 'username',
        }
        await fetch.patchUser(body);
    });

     */

}


export async function populateCompany(container) {
    const user = await fetch.getUser();



    if (user.company !== null) {
            container.innerHTML = '';

            container.innerHTML = `
                    <div class="user-list">
                        <h2 style="justify-content: center"><b>${user.company.name}</b></h2>
                        <p>${user.company.location}</p>
                    </div>
                    `;
    }
}


export async function populateCompanyMembers(container) {
    const user = await fetch.getUser();
    const companyMembers = await fetch.getUsersByCompany(user.company.id);

    if (Array.isArray(companyMembers)) {
        container.innerHTML = '';

        for (const member of companyMembers) {
            const membersElement = document.createElement('div');
            membersElement.innerHTML = `
                <div class="user-list">
                
                <div class="profile-photo">
                        <img style="width: 40px" src="../img/nopictures.jpg" alt="Profile Photo">
                    </div>
                    <div style="text-align: center">
                        <b>${member.username}</b>
                    </div>
                    <div style="text-align: center">
                        ${member.email}
                    </div>
                   
                </div>
            `;

            container.appendChild(membersElement);
        }
    }
}


export async function populateCompanyJobOffers(container) {
    const user = await fetch.getUser();
   const jobOffers = await fetch.getJobOffersByCompany(user.company.id);
   if (Array.isArray(jobOffers)) {
        container.innerHTML = '';

        for (const job of jobOffers) {
            const membersElement = document.createElement('div');
            membersElement.innerHTML = `
            <div class="user-list">
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                    <h1 class="card-title">${job.title}</h1>
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                    ${job.company.location}
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                    ${job.category}
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                    ${job.working_time}
                </td>
            </div>
                
            `;

            container.appendChild(membersElement);
        }
    }

}


export async function populateJobOffers(container) {
    const jobOffers = await fetch.getAllJobOffers();

    container.innerHTML = '';

    if (typeof jobOffers === 'string') {
        container.textContent = jobOffers;
    } else if (Array.isArray(jobOffers)) {
        for (const job of jobOffers) {
            const jobElement = document.createElement('div');
            jobElement.classList.add("card-wrap");
            jobElement.innerHTML = `
        <div class="card-header ${job.category.toLowerCase()}">
            <i class="${job.category.toLowerCase()}"> ${job.category.toUpperCase()}</i>
        </div>
        <div class="card-content">
            <h1 class="card-title">Job Title: ${job.title}</h1>
            <p class="card-text">Location: ${job.company.location}<br>
                Contract Type: ${job.category} <br>
                Duration: ${job.working_time}</p>
            <button class="card-btn" job-id="${job.id}">see more</button>
        </div>
            `;
            container.appendChild(jobElement);
        }

        const seeMoreButtons = document.getElementsByClassName('card-btn');
        for (const button of seeMoreButtons) {
            console.log(button)
            button.addEventListener('click', async function() {
                console.log('button clicked')
                const applicationModal = document.getElementById('applicationModal');
                console.log(applicationModal)
                const job_id = button.getAttribute('job-id');

                await populateJobModal(applicationModal, job_id);
                applicationModal.classList.add("show");
                applicationModal.style.display = 'block';
                // overlay.style.display = 'block';
            });
        }

        /*
        const applyButton = jobElement.querySelector(`#applyButton-${job.id}`);
            // const deleteButton = jobElement.querySelector(`#deleteButton-${job.id}`);
            applyButton.addEventListener('click', () => fetch.applyToJob(job.id));
            //deleteButton.addEventListener('click', () => fetch.deleteJobOffer(job.id));

         */
    }
}


export async function populateJobModal(container, job_id) {
    const job = await fetch.getJobOffer(job_id);

    console.log(job)

    container.innerHTML = '';

    container.innerHTML =  `
                    <header>
                        <span>Job Title: ${job.title} (${job.category})</span>
                        <div class="close"><i id="closeModal" class="uil uil-times"></i></div>
                    </header>
                    <div class="content">
                        <p><b>Location:</b> ${job.company.location}<br>
                        <b>Company Name:</b> ${job.company.name}<br>
                        <b>Contract Type:</b> ${job.category}<br>
                        <b>Salary:</b> ${job.salary}<br>
                        <b>Duration:</b> ${job.working_time} <br>
                        <b>Description:</b> ${job.description}<br>
                        <b>Creation date:</b> ${job.created_at}<br>
            
            </p>
                        <div class="field">
                            <button class="apply-btn" id="applyButton">Apply</button>
                        </div>
                    </div>
                `;
    const applyButton = document.getElementById('applyButton');
    applyButton.addEventListener('click', () => fetch.applyToJob(job_id));

    const applicationModal = document.getElementById('applicationModal');
    const closeModalButton = document.getElementById('closeModal');

    closeModalButton.addEventListener('click', function() {
        applicationModal.classList.remove("show");
        applicationModal.style.display = 'none';
        //overlay.style.display = 'none';
    });

}


export async function populateUserApplications(container) {
    const userApplications = await fetch.getUserApplications();

    console.log(userApplications)

    container.innerHTML = '';

    for (const app of userApplications) {
        const appElement = document.createElement('div');
        appElement.classList.add("card-wrap");
        appElement.innerHTML = `
  <div class="card-header ${app.job_offer.category.toLowerCase()}">
            <i class="${app.job_offer.category.toLowerCase()}"> ${app.job_offer.category.toUpperCase()}</i>
        </div>
        <div class="card-content">
            <h1 class="card-title">Job Title: ${app.job_offer.title}</h1>
            <p class="card-text">Location: ${app.job_offer.company.location}<br>
                Contract Type: ${app.job_offer.category} <br>
                Duration: ${app.job_offer.working_time}</p>
            <button id="deleteButton-${app.id}" class="card-btn">Unsubscribe</button>
        </div>
              
        `;

        const deleteButton = appElement.querySelector(`#deleteButton-${app.id}`);
        deleteButton.addEventListener('click', async function(){
            await fetch.deleteUserApplication(app.id);
            location.reload()
        });

        container.appendChild(appElement);
    }
}


export async function populateSelectMenu(selectMenu, elements) {
    selectMenu.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select an option';
    selectMenu.appendChild(defaultOption);

    elements.forEach(element => {
        const option = document.createElement('option');
        option.value = element.id;
        option.textContent = element.name;
        selectMenu.appendChild(option);
    });
}
/*
 <button class="apply-btn" data-job-id="${job.id}">apply</button>


export async function populateUserProfile(container){
    const data = await fetch.getUser();


    let usernames = document.getElementsByClassName('user-name')
    Array.from(usernames).forEach(username => {
        username.textContent = data.username;
    });

    document.getElementById('user-email').textContent = data.email;
    document.getElementById('user-description').textContent = data.description;
    document.getElementById('user-formation').textContent = data.formation;
}


export async function populateJobOffers(){
    const data = await fetch.getAllJobOffers();
    console.log(data)

    const jobType = data.type;

    const newCard = document.createElement('div');
    newCard.className = 'card-wrap';
    newCard.innerHTML = `
        <div class="card-header ${jobType.toLowerCase()}">
            <i class="${jobType.toLowerCase()}"> ${jobType.toUpperCase()}</i>
        </div>
        <div class="card-content">
            <h1 class="card-title">Job Title: ${getData.title}</h1>
            <p class="card-text">Location: ${getData.location} <br>
                Contract Type: ${jobType} <br>
                Duration: ${getData.duration}</p>
            <button class="card-btn" data-popup="popup-${job.id}">see more</button>
        </div>
        <div class="popup" id="popup-${job.id}">
            <header>
                <span>Job Title: ${getData.title} (${jobType})</span>
                <div class="close"><i class="uil uil-times"></i></div>
            </header>
            <div class="content">
                <p>Location: ${getData.location}<br>
                    Contract Type: ${jobType}<br>
                    Duration: ${getData.duration} <br>
                    Description : ${getData.description}</p>
                    
                <div class="field">
                    <button class="apply-btn" data-job-id="${job.id}">apply</button>
                </div>
            </div>
        </div>
    `;
    container.appendChild(newCard);

    const newButton = newCard.querySelector('.card-btn');
    const newPopup = newCard.querySelector('.popup');
    newButton.onclick = () => {
        newPopup.classList.toggle("show");
    };
    const closeNewPopup = newPopup.querySelector(".close");
    closeNewPopup.onclick = () => {
        newPopup.classList.remove("show");
    };
    // Display job offers
}
*/
