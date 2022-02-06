//фильтрация
document.addEventListener('DOMContentLoaded', () => {

    let getSort = ({ target }) => {
        let order = (target.dataset.order = -(target.dataset.order || -1));
        let index = [...target.parentNode.cells].indexOf(target);
        let collator = new Intl.Collator(['en', 'ru'], { numeric: true });
        let comparator = (index, order) => (a, b) => order * collator.compare(
            a.children[index].innerHTML,
            b.children[index].innerHTML
        );
        for(let tBody of target.closest('table').tBodies)
            tBody.append(...[...tBody.rows].sort(comparator(index, order)));
        for(let cell of target.parentNode.cells)
            cell.classList.toggle('sorted', cell === target);
    };
    document.querySelectorAll('.table thead').forEach(tableTH => tableTH.addEventListener('click', () => getSort(event)));
});

//проверяем наличие элемента в local Storage
if (!localStorage.getItem('cars')){
    localStorage.setItem('cars', JSON.stringify([
        {   0: "good_0",
            1: "Mercedes",
            2: "EQE",
            3: "Серый",
            4: "9",
            5: "3730000",
            6: 0,
            7: 0,
        },
        {   0: "good_1",
            1: "Toyota",
            2: "RAV4",
            3: "Красный",
            4: "9",
            5: "3020000",
            6: 0,
            7: 0,
        },
        {   0: "good_2",
            1: "BMW",
            2: "X1",
            3: "Черный",
            4: "11",
            5: "2790000",
            6: 0,
            7: 0,
        },
        {   0: "good_3",
            1: "Haval",
            2: "F7x",
            3: "Синий",
            4: "8",
            5: "2199000",
            6: 0,
            7: 0,
        },
        {   0: "good_4",
            1: "Toyota",
            2: "Hiace",
            3: "Белый",
            4: "2",
            5: "5234000",
            6: 0,
            7: 0,
        }
    ]))
}
//параметры для поиска
let options = {
    valueNames: ['name', 'price']
}
let userList

//кнопка для добавления нового автомобиля
document.querySelector("button.add_new").addEventListener('click', function (e){
    let name = document.getElementById('good_name').value
    let model = document.getElementById('good_model').value
    let color = document.getElementById('good_color').value
    let count = document.getElementById('good_count').value
    let price = document.getElementById('good_price').value
    if(name && model && color && count && price) {
        document.getElementById('good_name').value = ""
        document.getElementById('good_model').value = ""
        document.getElementById('good_color').value = ""
        document.getElementById('good_count').value = "1"
        document.getElementById('good_price').value = "1"
//конвертируем полученные данные в массив
        let cars = JSON.parse(localStorage.getItem('cars'))
        cars.push(['good_'+Math.floor(Math.random( ) * (1000+1)), name, model, color, count, price, 0, 0])
        localStorage.setItem('cars', JSON.stringify(cars))
//обновить отображение интерфейса
        update_cars()
//сообщение об ошибке при неверном вводе данных
    }else{
        alert('проверьте верность введенных данных')
    }
})
update_cars()
//функция обновления интерфейса
function update_cars(){
    let tbody = document.querySelector('.list')
    tbody.innerHTML = ""
    let cars = JSON.parse(localStorage.getItem('cars'))
    if(cars.length){
        for (let i = 0; i<cars.length; i++ ){
            tbody.insertAdjacentHTML('beforeend',
                `
                <tr class="align-middle">
                    <td class="table_head__number">${i+1}</td>
                    <td class="name table_head__item">${cars[i][1]}</td>
                    <td class="model table_head__item">${cars[i][2]}</td>
                    <td class="color table_head__item">${cars[i][3]}</td>
                    <td class="count table_head__item">${cars[i][4]}</td>
                    <td class="price table_head__item">${cars[i][5]}</td>
                    <td> <button class="good_delete btn_delete--position" data-delete="${cars[i][0]}">✖</button></td>
                    <td> 
                        <button class="btn_refactor">
                            <a href="#exampleModal" class="good_refactor" data-cars="${cars[i][0]}">✎</a>
                        </button>
                    </td>
                </tr>
                `
            )
        }

//стили для скрытия кнопки "сохранить изменения" и надписи "Изменить данные"
        let btnAdd = document.querySelector('.btn_add');
        let save = document.querySelector('.add_new');
        let refactor = document.querySelector('.refactor');
        let addLabel = document.querySelector('#exampleModalLabel');
        let refactorLabel = document.querySelector('#exampleModalLabel__2');
        btnAdd.addEventListener('click', () => {
//очищаем форму
            formReset()
            save.style.display = 'block';
            refactor.style.display = 'none' ;
            addLabel.style.display = 'block' ;
            refactorLabel.style.display = 'none' ;
        });
//использование библиотеки для поиска
        userList = new List('cars', options);
    } else {
        table.hidden = true;
    }
}
function formReset(){
    document.querySelector(".modal-body").reset();
}
//обработка удаления элемента
document.querySelector('.list').addEventListener('click', function (e){
    if(!e.target.dataset.delete){
        return
    }
//предупреждение об удалении элемента
    if(confirm('Удалить пользователя?')) {
        let cars = JSON.parse(localStorage.getItem('cars'))
        for(let i=0; i<cars.length; i++){
            if(cars[i][0] === e.target.dataset.delete){
                cars.splice(i, 1)
                localStorage.setItem('cars', JSON.stringify(cars))
                update_cars()
            }
        }
        alert('Пользователь удалён');
    } else {
// закрыть окно
    }
})
//редактирование автомобиля
document.querySelector('.list').addEventListener('click', function (e){
    if(!e.target.dataset.cars){
        return
    }else{
        let cars = JSON.parse(localStorage.getItem('cars'))
        for(let i=0; i<cars.length; i++){
            if(cars[i][0] === e.target.dataset.cars){
//стили для скрытия кнопки "сохранить" и надписи "добавить автомобиль"
//добавлены сюда тк нужен отдельный id каждой кнопки
                document.querySelector('.add_new').style.display = 'none';
                document.querySelector('.refactor').style.display = 'block';
                document.querySelector('#exampleModalLabel__2').style.display = 'block';
                document.querySelector('#exampleModalLabel').style.display = 'none';

                let name = document.getElementById('good_name').value = cars[i][1]
                let model = document.getElementById('good_model').value = cars[i][2]
                let color = document.getElementById('good_color').value = cars[i][3]
                let count = document.getElementById('good_count').value = cars[i][4]
                let price = document.getElementById('good_price').value = cars[i][5]
                document.querySelector("button.refactor").addEventListener('click', function (e){
                    if(name && model && color && count && price) {

//конвертируем полученные данные в массив
                        let editing = {
                            0: cars[i][0],
                            1: document.getElementById('good_name').value,
                            2: document.getElementById('good_model').value,
                            3: document.getElementById('good_color').value,
                            4: document.getElementById('good_count').value,
                            5: document.getElementById('good_price').value,
                            6: cars[i][6],
                            7: cars[i][7]}
                        let refactor = JSON.parse(localStorage.getItem('cars'))
                        refactor[i] = editing
                        localStorage.setItem("cars", JSON.stringify(refactor))
                        console.log(refactor)

                        //перезагрузка страницы, неприемлимо в принципе, но иначе не смог решить проблему - одна строка редактируется верно
                        //но следующая уже выводит некоректные результаты
                        setTimeout(function (){
                            location.reload();}, 1000);
                        formReset()
                        update_cars()
                    }
                    else{
                        alert('проверьте верность введенных данных')
                    }
                })
            }
        }

    }
})

