const API_URL = "http://127.0.0.1:8000/api/";
const token = sessionStorage.getItem('authToken');

async function getData(url, token) {
    try {
        let headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Token ${token}` }),
        };

        const response = await fetch(url, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return null;
        }

        return await response.json();

    } catch (error) {
        console.error('There was a problem with the GET operation:', error);
        return null;
    }
}

async function postData(url, body, token) {
    try {
        let headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Token ${token}` }),
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return null;
        }

        return await response.json();

    } catch (error) {
        console.error('There was a problem with the POST operation:', error);
        return null;
    }
}

async function patchData(url, body, token) {
    try {
        let headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Token ${token}` }),
        };

        const response = await fetch(url, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return null;
        }

        return await response.json();

    } catch (error) {
        console.error('There was a problem with the PATCH operation:', error);
        return null;
    }
}

async function deleteData(url, token) {
    try {
        let headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Token ${token}` }),
        };

        const response = await fetch(url, {
            method: 'DELETE',
            headers: headers,
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return null;
        }

    } catch (error) {
        console.error('There was a problem with the DELETE operation:', error);
        return null;
    }
}



export async function loginUser(content) {
    return await postData(`${API_URL}login/`, content)
}


export async function registerUser(content) {
    return await postData(`${API_URL}register/`, content)
}


export async function getUser() {
    if (!token) {
        console.error('No token provided');
        return null;
    }

    return await getData(`${API_URL}users/profile/`, token)
}


export async function getUsersByCompany(companyId) {
    if (!token) {
        console.error('No token provided');
        return null;
    }

    return await getData(`${API_URL}users/by-company/${companyId}/`, token)
}


export async function getAllUsers() {
    if (!token) {
        console.error('No token provided');
        return null;
    }

    return await getData(`${API_URL}users/`, token)
}


export async function patchUser(body) {
    if (!token) {
        console.error('No token provided');
        return null;
    }

    return await patchData(`${API_URL}users/profile/`, body, token)
}


export async function deleteUser() {
    if (!token) {
        console.error('No token provided');
        return null;
    }

    return await deleteData(`${API_URL}users/delete_account/`, token)
}


export async function adminPatchUser(userId, body) {
    if (!token) {
        console.error('No token provided');
        return null;
    }

    return await patchData(`${API_URL}users/edit-user/${userId}/`, body, token)
}

export async function adminDeleteUser(userId) {
    if (!token) {
        console.error('No token provided');
        return null;
    }

    return await deleteData(`${API_URL}users/delete-user/${userId}/`, token)
}


export async function createCompany(content) {
    if (!token) {
        console.error('No token provided');
        return null;
    }

    return await postData(`${API_URL}companies/`, content, token)
}


export async function getCompany(id) {
    return await getData(`${API_URL}companies/${id}/`);
}


export async function getAllCompanies() {
    if (!token) {
        console.error('No token provided');
        return null;
    }

    return await getData(`${API_URL}companies/`, token);
}


export async function updateUserCompany(companyId) {
    if (!token) {
        console.error('No token provided');
        return null;
    }

    const content = {
        company: companyId,
    };

    return await patchData(`${API_URL}users/profile/`, content, token);
}


export async function patchCompany(companyId, content) {
    if (!token) {
        console.error('No token provided');
        return null;
    }

    return await patchData(`${API_URL}companies/${companyId}/`, content, token);
}


export async function deleteCompany(companyId) {
    if (!token) {
        console.error('No token provided');
        return null;
    }

    return await deleteData(`${API_URL}companies/${companyId}/`, token);
}


export async function createJobOffer(content) {
    if (!token) {
        console.error('No token provided');
        return null;
    }

    return await postData(`${API_URL}joboffers/`, content, token)
}


export async function getJobOffer(jobId) {
    try {
        const jobOffer = await getData(`${API_URL}joboffers/${jobId}/`);

        return jobOffer;
    } catch (error) {
        console.error('Error fetching job offer:', error);
        return "An error occurred while fetching job offer.";
    }
}


export async function getJobOffersByCompany(companyId) {
    if (!token) {
        console.error('No token provided');
        return null;
    }

    return await getData(`${API_URL}joboffers/by-company/${companyId}/`, token)
}


export async function getAllJobOffers() {
    try {
        const jobOffers = await getData(`${API_URL}joboffers/`);

        if (jobOffers.length === 0) {
            return "No job offers available.";
        }

        return jobOffers;
    } catch (error) {
        console.error('Error fetching job offers:', error);
        return "An error occurred while fetching job offers.";
    }
}


export async function patchJobOffer(jobId, body) {
    if (!token) {
        console.error('No token provided');
        return null;
    }

    return await patchData(`${API_URL}joboffers/${jobId}/`, body, token);
}


export async function deleteJobOffer(jobId) {
    if (!token) {
        console.error('No token provided');
        return null;
    }

    return await deleteData(`${API_URL}joboffers/${jobId}/`, token);
}


export async function applyToJob(jobId) {
    if (!token) {
        console.error('No token provided');
        return null;
    }

    const applicationData = {
        job_offer: jobId
    };
    return await postData(`${API_URL}applications/`, applicationData, token);
}


export async function getUserApplications() {
    if (!token) {
        console.error('No token provided');
        return null;
    }

    return await getData(`${API_URL}applications/`, token);
}

export async function deleteUserApplication(appId) {
    if (!token) {
        console.error('No token provided');
        return null;
    }

    return await deleteData(`${API_URL}applications/${appId}/`, token);
}
