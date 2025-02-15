import { inputText, chatContainer, button} from "./constants.js";

const classMapping = new Map();
classMapping.set("USER", "user__message");
classMapping.set("BOT", "bot__message");

const imageMapping = new Map();
imageMapping.set("USER", "/images/user.png");
imageMapping.set("BOT", "/images/bot.png");

const pointCategories = new Map();

const availableProducts = [
    {
        name: "Cadeira Gamer",
        description: "Cadeira Gamer com design moderno e confortável, excelente para home office e escritório também",
        price: 1200,
        image: "https://static.mundomax.com.br/produtos/70521/100/1.webp",
        descriptionGeneratedByBot: "Se você deseja uma cadeira excelente para o escritório, essa pode ser uma boa opção. Uma escolha excelente também para gamers."
    },
    {
        name: "Cadeira de Escritório",
        description: "Cadeira de escritório com design moderno e confortável, boa para home office e escritório",
        price: 800,
        image: "https://dcf83otphg8a2.cloudfront.net/Custom/Content/Products/98/88/988852_cadeira-escritorio-presidente-base-cromada-preta-mb-c730-20028_m1_637626398061654943.webp",
        descriptionGeneratedByBot: "Essa cadeira é perfeita para o ambiente corporativo, home office e escritório. Com um design moderno e confortável, ela é uma excelente escolha."
    },
    {
        name: "Cadeira de Praia",
        description: "Cadeira de praia com design moderno e confortável, boa para férias e descanso",
        price: 1000,
        image: "https://minipreco.vtexassets.com/arquivos/ids/186643/83087b82-7358-4a8f-a923-d81191e74efd.jpg?v=638289344578430000",
        descriptionGeneratedByBot: "Essa cadeira é perfeita para relaxar e aproveitar as férias. Se deseja curtir as férias com conforto, essa é a escolha certa."
    
    },
    {
        name: "Cadeira de Auditório",
        description: "Cadeira de auditório com design moderno e ergonômico",
        price: 900,
        image: "https://moveissaara.com.br/wp-content/uploads/2018/09/cadeira-auditorio-saara-001-1.jpg",
        descriptionGeneratedByBot: "Essa cadeira é perfeita para auditórios e salas de reunião. Garante que todos fiquem confortáveis e com uma postura correta."
    },
    {
        name: "Cadeira de Home Office",
        description: "Cadeira de home office com design moderno e confortável boa para escritório e home office",
        price: 950,
        image: "https://www.longarinasmetalicas.com/assets/img/produtos/produto-28-cadeira-para-escritorio-elite-flex-plus-presidente-com-encosto-de-cabeca-assento-estofado-encosto-em-tela-cadeiras-home--239631.jpg",
        descriptionGeneratedByBot: "Essa cadeira é perfeita para quem trabalha em casa. Visto que foi pensanda em cada detalhe, ela é uma excelente escolha para home office."
    }
]

function createMessageElement(text, origin = "USER") {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message__container");
    messageContainer.classList.add(classMapping.get(origin));

    const messageText = document.createElement("p");
    messageText.classList.add("message__text");
    if (text instanceof HTMLElement) {
        messageText.appendChild(text)
    } else {
        messageText.textContent = text;
    }

    messageContainer.appendChild(messageText);

    const image = document.createElement("img");
    image.classList.add("profile__image");
    image.src = imageMapping.get(origin);
    messageContainer.appendChild(image);

    return messageContainer;
}

function activeElement(element, time) {
    setTimeout(() => {
        element.classList.add("active");
    }, time);
}

function sendMessage() {
    
    const message = inputText.value;

    if (message.trim() === "") {
        return;
    }

    inputText.value = "";

    const userPromptContainer = createMessageElement(message);
    chatContainer.appendChild(userPromptContainer);
    userPromptContainer.scrollIntoView({ behavior: "smooth" });
    activeElement(userPromptContainer, 10);
    setTimeout(() => {
        const botAnswer = generateTextAnswerBasedInUserInput(message);
        const botAnswerContainer = createMessageElement(botAnswer, "BOT");
        chatContainer.appendChild(botAnswerContainer);
        activeElement(botAnswerContainer, 100);
        botAnswerContainer.scrollIntoView({ behavior: "smooth" });
    }, 2000);   
}

function startPointingMap() {
    pointCategories.set("cadeira", 0);
    pointCategories.set("gamer", 0);
    pointCategories.set("escritório", 0);
    pointCategories.set("férias", 0);
    pointCategories.set("praia", 0);
    pointCategories.set("auditório", 0);
    pointCategories.set("home office", 0);
    pointCategories.set("confortável", 0);
}

function generateTextAnswerBasedInUserInput(text) {
    startPointingMap();
    let answer = "";
    
    const lowerCaseText = text.toLowerCase();
    for (const [category, points] of pointCategories) {
        if (lowerCaseText.includes(category)) {
            pointCategories.set(category, 1);
        }
    }
    const categories = [];
    const sortedCategoriesPoints = Array.from(pointCategories).sort((a, b) => b[1] - a[1]).flat();
    sortedCategoriesPoints.forEach((element, index) => {
        if (index % 2 !== 0 && element === 1) {
            categories.push(sortedCategoriesPoints[index - 1]);
        }
    })
    if (categories.length === 0) {
        return "Desculpe, não entendi o que você quis dizer.";
    }

    const filteredProducts = new Set();
    const firstCategory = categories.shift();
    availableProducts.forEach((product) => {
        if (product.name.toLowerCase().includes(firstCategory) || product.description.toLowerCase().includes(firstCategory)) {
            filteredProducts.add(product);
        }
    });
    
    categories.forEach((category) => {
        const filteredProductsCopy = new Set(filteredProducts);
        filteredProductsCopy.forEach((product) => {
            if (!product.name.toLowerCase().includes(category) && !product.description.toLowerCase().includes(category)) {
                filteredProducts.delete(product);
            }
        })
    });

    if (filteredProducts.size === 0) {
        return "Desculpe, não encontramos produtos com essas características.";
    }

    answer = paginateProducts(Array.from(filteredProducts).sort((a, b) => {
        a = a.name.toLowerCase();
        b = b.name.toLowerCase();
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }

        return 0;
    }));

    return answer;

    
}

function paginateProducts(products, page = 1, productsPerPage = 3) {
    const container = document.createElement("p");

    const startIndex = (page - 1) * productsPerPage;
    const endIndex = Math.min(page * productsPerPage, products.length);
    for (let i = startIndex; i < endIndex; i++) {
        const card = document.createElement("div");
        card.className = "product__card";
        card.innerHTML = `
            <br> ${products[i].name}
            <br><img src="${products[i].image}" alt="${products[i].name}" class="product__image"><br>
            <br><p class="bot__generated__description">${products[i].descriptionGeneratedByBot}</p>
        `;
        container.appendChild(card);
    }

    if (endIndex < products.length) {
        const loadMoreBtn = document.createElement("button");
        loadMoreBtn.textContent = "Ver mais produtos";
        loadMoreBtn.className = "load__more__btn";
        loadMoreBtn.addEventListener("click", function(event) {

            this.parentElement.appendChild(paginateProducts(products, page + 1, productsPerPage));
            
            this.remove();
        });
        container.appendChild(loadMoreBtn);
    }
    return container;
}

function init() {
    
    button.addEventListener("click", sendMessage);
}

window.onload = init;
window.onkeydown = (event) => {
    if (event.key === "Enter") {
        button.click();
    }
}
