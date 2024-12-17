const createProduct = document.querySelector('.create-btn');
const cancel = document.querySelector('.cancel');
const productName = document.querySelector('#productName');
const productBrand = document.querySelector('#productBrand');
const productCategory = document.querySelector('#productCategory');
const productPrice = document.querySelector('#productPrice');
const productDescription = document.querySelector('#productDescription');
const fileSelector = document.querySelector('.file-selector');
const addBtn = document.querySelector('#click');
const mainTitle = document.querySelector('.main-title');

let products = [];
let action = 'create';
let tmpIndex;
let fileList;

// Display modal
createProduct.addEventListener('click', function () {
    document.querySelector('.my-modal').classList.remove('d-none');
});

// Hide modal
cancel.addEventListener('click', function () {
    document.querySelector('.my-modal').classList.add('d-none');
    clearData();
    clearErrorAll(productBrand);
    clearErrorAll(productCategory);
    clearErrorAll(productName);
    clearErrorAll(productPrice);
    clearErrorAll(fileSelector);
});

// File selection 
fileSelector.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const errorElement = fileSelector.nextElementSibling;
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            fileList = e.target.result;
        };
        reader.readAsDataURL(file);
        fileSelector.classList.remove('is-invalid');
        fileSelector.classList.add('is-valid');
        errorElement.textContent = '';
    } else {
        fileSelector.classList.remove('is-valid');
        fileSelector.classList.add('is-invalid');
        errorElement.textContent = 'Please select a valid product image.';
    }
});

// Load products from local storage
if (localStorage.getItem('products') != null) {
    products = JSON.parse(localStorage.getItem('products'));
    displayProducts();
}

// array of object
addBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    const product = {
        name: productName.value,
        brand: productBrand.value,
        category: productCategory.value,
        price: productPrice.value,
        description: productDescription.value,
        image: fileList || ''
    };

    if (action === 'create') {
        products.push(product);
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Create product successfully"
          });
    } else {
        products[tmpIndex] = product;
        action = 'create';
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Update product successfully"
          });
    }

    localStorage.setItem('products', JSON.stringify(products));
    displayProducts();
    document.querySelector('.my-modal').classList.add('d-none');
    clearData();

});

// validate while typing
productName.addEventListener('input', () => 
    validateField(productName, /^(?=.*[A-Z])[a-zA-Z ]{3,20}$/, 'Product name must be 3-20 characters long and contain at least one capital letter.')
);
productBrand.addEventListener('input', () => 
    validateField(productBrand, /^(?=.*[A-Z])[A-Za-z0-9 ]{3,50}$/, 'Brand must be 3-50 characters long and include at least one uppercase letter.')
);
productCategory.addEventListener('input', () => 
    validateField(productCategory, /^(?=.*[A-Z])[a-zA-Z ]{3,20}$/, 'Category name must be 3-20 characters long and contain at least one capital letter.')
);
productPrice.addEventListener('input', () => 
    validateField(productPrice, /^(?!0\d)\d+(\.\d+)?$/, 'Price must be a valid positive number.')
);

// Function to validate input fields in while typing
function validateField(input, pattern, errorMessage) {
    const errorElement = input.nextElementSibling;
    if (pattern.test(input.value.trim())) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        errorElement.textContent = '';
    } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        errorElement.textContent = errorMessage;
    }
}

// Validate inputs
function validateInputs() {
    let isValid = true;

    // Validate product name
    if (!productName.value.trim() || productName.value.length < 3) {
        setError(productName, 'Product Name cannot be empty.');
        isValid = false;
    } else {
        clearError(productName);
    }

    // Validate product brand
    if (!productBrand.value.trim()) {
        setError(productBrand, 'Brand cannot be empty.');
        isValid = false;
    } else {
        clearError(productBrand);
    }

    // Validate product category
    if (!productCategory.value.trim()) {
        setError(productCategory, 'Category cannot be empty.');
        isValid = false;
    } else {
        clearError(productCategory);
    }

    // Validate product price
    if (!productPrice.value.trim() || isNaN(productPrice.value) || Number(productPrice.value) <= 0) {
        setError(productPrice, 'Price must be a valid positive number.');
        isValid = false;
    } else {
        clearError(productPrice);
    }

    // Validate product image
    if (!fileList) {
        setError(fileSelector, 'Please select a valid product image.');
        isValid = false;
    } else {
        clearError(fileSelector);
    }

    return isValid;
}

// Set error message
function setError(input, message) {
    const parent = input.parentElement;
    let error = parent.querySelector('.error-message');
    if (!error) {
        error = document.createElement('small');
        error.className = 'error-message';
        error.style.color = 'red';
        parent.appendChild(error);
    }
    error.textContent = message;
    input.classList.add('is-invalid');
}

// Clear error message
function clearError(input) {
    const errorElement = input.nextElementSibling;
    if (errorElement) errorElement.textContent = '';
    input.classList.remove('is-invalid');
}
function clearErrorAll(input) {
    const errorElement = input.nextElementSibling;
    if (errorElement) errorElement.textContent = '';
    input.classList.remove('is-invalid','is-valid');
}

// Clear data
function clearData() {
    productName.value = '';
    productBrand.value = '';
    productCategory.value = '';
    productPrice.value = '';
    productDescription.value = '';
    fileSelector.value = '';
    fileList = null;

    clearErrorAll(productName);
    clearErrorAll(productBrand);
    clearErrorAll(productCategory);
    clearErrorAll(productPrice);
    clearErrorAll(fileSelector);
}

// Display products
function displayProducts() {
    const result = products
        .map((product, index) => {
            return `
            <tr>
                <td>${index}</td>
                <td>${product.name}</td>
                <td>${product.brand}</td>
                <td>${product.category}</td>
                <td>${product.price}</td>
                <td><img src="${product.image}" alt="img" style="max-width: 200px; height: auto;"></td>
                <td><button class="btn btn-secondary" onclick="updateProduct(${index})">Edit</button></td> 
                <td><button class="btn btn-danger" onclick="deleteProduct(${index})">Delete</button></td>        
            </tr>
        `;
        })
        .join(' ');

    document.querySelector('#data').innerHTML = result;
}

// Delete product
function deleteProduct(index) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to delete this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
            products.splice(index, 1);
            localStorage.setItem('products', JSON.stringify(products));
            displayProducts();
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              });
              Toast.fire({
                icon: "success",
                title: "delete product successfully"
              });
        }
      });
    
    
}

// Update product
function updateProduct(i) {
    document.querySelector('.my-modal').classList.remove('d-none');
    productName.value = products[i].name;
    productBrand.value = products[i].brand;
    productCategory.value = products[i].category;
    productPrice.value = products[i].price;
    productDescription.value = products[i].description;
    action = 'update';
    tmpIndex = i;
    addBtn.value = 'Update Product';
    mainTitle.innerHTML = 'Update Product';
}




// search products
let searchMood = 'name';
function getSearchMood(id){
    let search = document.querySelector('#search');
    if(id == 's-name'){
        searchMood = 'name';
        search.placeholder = 'Search by name';
    }
    else{
        searchMood = 'category';
        search.placeholder = 'Search by category';
    }

}
function searchProducts(value){
    
    let table = '';
    products.forEach((product,index)=>{
        if(searchMood == 'name'){
            if(product.name.toLowerCase().includes(value.toLowerCase())){
                table += `
                        <tr>
                            <td>${index}</td>
                            <td>${product.name}</td>
                            <td>${product.brand}</td>
                            <td>${product.category}</td>
                            <td>${product.price}</td>
                            <td><img src="${product.image}" alt="img" style="max-width: 200px; height: auto;"></td>
                            <td><button class="btn btn-secondary" onclick="updateProduct(${index})">Edit</button></td> 
                            <td><button class="btn btn-danger" onclick="deleteProduct(${index})">Delete</button></td>         
                        </tr>
                
                `;
            }
        }
        else{
            if(product.category.toLowerCase().includes(value.toLowerCase())){
                table += `
                        <tr>
                            <td>${index}</td>
                            <td>${product.name}</td>
                            <td>${product.brand}</td>
                            <td>${product.category}</td>
                            <td>${product.price}</td>
                            <td><img src="${product.image}" alt="img" style="max-width: 200px; height: auto;"></td>
                            <td><button class="btn btn-secondary" onclick="updateProduct(${index})">Edit</button></td> 
                            <td><button class="btn btn-danger" onclick="deleteProduct(${index})">Delete</button></td>         
                        </tr>
                
                `;
            }
        }
        
    })
    document.querySelector('#data').innerHTML = table;
}


//delete all products 
document.querySelector('.delete-all-btn').addEventListener('click',() =>{
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to delete all products!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
            products = [];
            localStorage.setItem("products",JSON.stringify(products));
            displayProducts();
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              });
              Toast.fire({
                icon: "success",
                title: "delete products successfully"
              });
        }
      });

})



