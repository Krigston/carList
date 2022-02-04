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
if (!localStorage.getItem('goods')){
    localStorage.setItem('goods', JSON.stringify([
        {   0: "good_0",
            1: "Mercedes",
            2: "EQE",
            3: "Серый",
            4: "9",
            5: "3 730 000",
            6: 0,
            7: 0,
        },
        {   0: "good_1",
            1: "BMW",
            2: "X1",
            3: "Черный",
            4: "11",
            5: "2 790 000",
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
        let goods = JSON.parse(localStorage.getItem('goods'))
        goods.push(['good_'+Math.floor(Math.random( ) * (1000+1)), name, model, color, count, price, 0, 0])
        localStorage.setItem('goods', JSON.stringify(goods))
//обновить отображение интерфейса
        update_goods()
//закрыть окно после ввода данных
//сообщение об ошибке при неверном вводе данных
    }
})
update_goods()
//функция обновления интерфейса
function update_goods(){
    let tbody = document.querySelector('.list')
    tbody.innerHTML = ""
    let goods = JSON.parse(localStorage.getItem('goods'))
    console.log(goods)
    if(goods.length){
        table.hidden = false
        for (let i = 0; i<goods.length; i++ ){
            tbody.insertAdjacentHTML('beforeend',
                `
                <tr class="align-middle">
                    <td class="table_head__number">${i+1}</td>
                    <td class="name table_head__item">${goods[i][1]}</td>
                    <td class="model table_head__item">${goods[i][2]}</td>
                    <td class="color table_head__item">${goods[i][3]}</td>
                    <td class="count table_head__item">${goods[i][4]}</td>
                    <td class="price table_head__item">${goods[i][5]}</td>
                    <td> <button class="good_delete btn_delete--position" data-delete="${goods[i][0]}">✖</button></td>
                    <td> <button class="good_delete btn_refactor--position" data-goods="${goods[i][0]}">✎</button></td>
                </tr>
                `
            )
        }
//использование библиотеки для поиска
        userList = new List('goods', options);
    } else {
        table.hidden = true;
    }
}
//обработка удаления элемента
document.querySelector('.list').addEventListener('click', function (e){
    if(!e.target.dataset.delete){
        return
    }
//предупреждение об удалении элемента
    if(confirm('Удалить пользователя?')) {
        let goods = JSON.parse(localStorage.getItem('goods'))
        for(let i=0; i<goods.length; i++){
            if(goods[i][0] === e.target.dataset.delete){
                goods.splice(i, 1)
                localStorage.setItem('goods', JSON.stringify(goods))
                update_goods()
            }
        }
        alert('Пользователь удалён');
    } else {
// закрыть окно
    }
})