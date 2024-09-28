import axios from 'axios'

async function getLangData(lang) {
    try {
        console.log(`Downloading ${lang}...`);
        const headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'en,sv;q=0.8,en-US;q=0.5,sv-SE;q=0.3',
            'Connection': 'keep-alive',
            'Host': 'crowdin.com',
            'Priority': 'u=0, i',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'TE': 'trailers',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0',
        };
        const cookieString = 'cookieyes-consent=consentid:Tk9VZ3k0cGg3YTZUdThsMklhd1FhS1p0blZ5UWNDd1Q; s_partner=https://crowdin.com/profile; m_partner=referrer; c_partner=c_referral; cid=f8c62lqc2ao3seq4gtqse22vk9; CSRF-TOKEN=lk72t89PiYtfX1Hv3xGrgvMuwzDW2COmsMPRF7rh; csrf_token=5a064thd8a; token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJzZXNzaW9uIiwianRpIjoiZmM3OWRkN2NiOWJjMTQxNWE5ZDJkYWI3M2UzODc1Y2U0Y2U3Nzk4ZjdjZTM0MTA2NzYxNDE0OWJmOWEzZWYxNTMxNDg3OWM5N2ZjZTUzZmQiLCJpYXQiOjE3Mjc1NDg4MDEuNDE2MTY3LCJuYmYiOjE3Mjc1NDg4MDEuNDE2MTcsImV4cCI6MTcyNzU1MjQwMS4wMTkyMTYsInN1YiI6IjE1NTUxNDUzIiwic2NvcGVzIjpbIioiXSwiZG9tYWluIjpudWxsLCJhc3NvY2lhdGlvbnMiOlsiKiJdLCJsb2dpbl9tZXRob2QiOiJnb29nbGUiLCJzZXNzaW9uIjoxLCJoYXNoIjoiNU1YekI4WGZtOVdZeHpZdFhQTjJHSXFzRmV1Y3I4SnQifQ.NyQ90TcMcz7m-FzuReYtSHk3WHQHXyWLeGT2Z7iYacv1B_RuqHxLFrwrBUUT_jNMURyCWJLTEqFzM5tsxW6NiXaQJ9alxT1j0RzL7gdEYIrTMZKaOkCiVSA0MdI_4tBR2tEKjfMHGi8nRFk64vt-3ejg_Y_yIL44zDL4EmPWq7N4EddNHDFwDuXz63dLSCmXdWINa3HEUHGfC_bsE41y4I1UeM1KWjZFcCcBLlFBMZeFhUyAt9JD-G_s-655wtu2HJdMJogwYcKLrx-0UYOTerw_FFkMT7H-uAzFjbEm3ympUaryQcFyoURv1tWG2Asj1z5dUxA_tIrt59B0F3xPGu6T0xX7aV7gWoxAWaMTF0Gs3Bpp5Irg3--1C5APyH8wWBYI74XXae4PPccZlDdDUdHac0hVM4zAPDysXPyNXcNK19BbR6Bf3HxVMosPIakcTk2fvK7_xk1QXTDDmim6YAB7WRXKyEA5l-sBL7tmUhfYvPGKb70ofluxUuXQFAs77udjSoikyPtrSbu6zkvB7Yuf2KKR1naMQ0_0CIfJ_2n7Uj-DKxlB87PET9MFExHO_SfkAFjW8hwFIX-7Lcf5DuNG1J8bQFL1QA6m_bbnwxB7wjREx_vAi8GhsUZV4R7-2SH-VVCqudZLWsQSzrVPbY5BdT0zYZZD12XloBTer60; jwt=1';
        headers.Cookie = cookieString
        const response = await axios.get(`https://crowdin.com/backend/project/rust/sv/22588/export`, { headers });
        const link = response.data?.url;
        const linkData = await axios.get(link) // No Headers needed when downloading
        const data = linkData.data;
        console.log(data);
    } catch (error) {
        console.log(error)
    }
}

getLangData("sv-SE")