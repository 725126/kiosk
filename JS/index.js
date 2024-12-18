    // 탭 메뉴(> 탭 버튼 클릭) 함수 
    function tabBtn(code) {
        let lunchMenu, dinnerMenu;
        let lunchBtn, dinnerBtn;

        lunchBtn = document.querySelector('#lunchBtn');
        dinnerBtn = document.querySelector('#dinnerBtn');

        lunchMenu = document.querySelector('#lunchMenu');
        dinnerMenu = document.querySelector('#dinnerMenu');


        // code: 1 - 점심메뉴
        if (code === 1) {
            lunchBtn.style.backgroundColor = '#708871';
            dinnerBtn.style.backgroundColor = '#BEC6A0';

            lunchMenu.style.display = 'flex';
            dinnerMenu.style.display = 'none';

        }

        // code: 2 - 저녁메뉴
        else if (code === 2) {
            dinnerBtn.style.backgroundColor = '#708871';
            lunchBtn.style.backgroundColor = '#BEC6A0';

            dinnerMenu.style.display = 'flex';
            lunchMenu.style.display = 'none';
        }
    }

    // 탭 메뉴 > 메뉴 선택 > 선택한 메뉴 업데이트 함수
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            let info = item.querySelector('.item-info');
            info.style.backgroundColor = '#E9EED9';
            info.style.border = '2px solid #AB4459';
            const name = item.dataset.name;
            const price = parseInt(item.dataset.price, 10);
            const code = parseInt(item.dataset.code);
            const id = item.dataset.id;

            if (code != 0) {
                deleteCartMenu(item, id);
            } else {
                // 담긴 메뉴는 코드 0 > 1 
                item.dataset.code = '1';

                // cart item 요소 생성
                const cartItemDiv = document.createElement('div');
                cartItemDiv.className = 'cart-item';
                cartItemDiv.id = 'cartItem' + id;

                // p 태그 생성
                const pTag = document.createElement('p');
                const menuNamelabel = document.createElement('label');
                menuNamelabel.textContent = name;

                // 삭제 버튼 생성
                const deleteSpan = document.createElement('span');
                deleteSpan.className = 'del-btn';
                deleteSpan.innerHTML = '<i class="fa-solid fa-x"></i>';
                deleteSpan.title = '삭제';
                deleteSpan.addEventListener('click', () => deleteCartMenu(item, id));

                // 수량 버튼 - 부모 요소 생성
                const quantitySpan = document.createElement('span');
                quantitySpan.className = 'quantity';
                quantitySpan.dataset.price = price;

                // 수량 버튼(input)
                const quantityInput = document.createElement('input');
                quantityInput.id = 'quantity' + id;
                quantityInput.type = 'text';
                quantityInput.value = '1';

                // 수량 버튼(+)
                const plusButton = document.createElement('button');
                plusButton.className = 'plus';
                plusButton.innerHTML = '<i class="fa-solid fa-plus"></i>';

                // 수량 버튼(-)
                const minusButton = document.createElement('button');
                minusButton.className = 'minus';
                minusButton.innerHTML = '<i class="fa-solid fa-minus"></i>';

                // 선택한 메뉴 가격 요소 추가
                const priceSpan = document.createElement('span');
                priceSpan.className = 'price';
                priceSpan.id = 'priceSpan' + id;
                priceSpan.textContent = price.toLocaleString();

                // 수량 버튼(+/-) 함수 설정
                plusButton.addEventListener('click', () => changeQuantity(priceSpan, plusButton, 1));
                minusButton.addEventListener('click', () => changeQuantity(priceSpan, minusButton, -1));

                // 수량 버튼 요소들 부모 요소(span)에 추가
                quantitySpan.appendChild(plusButton);
                quantitySpan.appendChild(quantityInput);
                quantitySpan.appendChild(minusButton);

                // 메뉴 요소들 부모 요소(p) 태그에 추가
                pTag.appendChild(deleteSpan);
                pTag.appendChild(menuNamelabel);
                pTag.appendChild(quantitySpan);
                pTag.appendChild(priceSpan);

                cartItemDiv.appendChild(pTag);

                let cartListDiv = document.querySelector('.cart-list');
                cartListDiv.appendChild(cartItemDiv);

                // 총 금액 업데이트
                updateTotalPrice(price);
            }

        });
    });

    // 선택한 메뉴 - 메뉴 삭제 함수 
    function deleteCartMenu(menuItem, menuId) {
        let removeItem = document.getElementById('cartItem' + menuId);
        let menuinfo = menuItem.querySelector('.item-info');
        let priceSpanText = document.getElementById('priceSpan' + menuId).textContent;
        let price = parseInt(priceSpanText.replace(/,/g, ''));

        if (confirm('해당 메뉴(' + menuItem.dataset.name + ')를 삭제하시겠습니까?')) {
            removeItem.remove();
            menuItem.dataset.code = '0';
    
            menuinfo.style.backgroundColor = '#FFF';
            menuinfo.style.border = '1px solid #606676';
            updateTotalPrice(price * -1);
        }
    }


    // 선택한 메뉴 - 수량(+/-) 계산 함수
    function changeQuantity(priceSpan, quantityButton, delta) {
        const quantityInput = quantityButton.parentElement.querySelector('input');
        let quantity = parseInt(quantityInput.value);

        const price = quantityButton.parentElement.dataset.price;
        let priceSpanText = priceSpan.textContent;
        let totalOneMenuPrice = parseInt(priceSpanText.replace(/,/g, ''));

        // 수량 증가 또는 감소
        quantity += delta;

        // 메뉴 수량: 0 이하 방지
        if (quantity > 0) {

            quantityInput.value = quantity;

            totalOneMenuPrice += price * delta;
            priceSpan.textContent = totalOneMenuPrice.toLocaleString();

            updateTotalPrice(price * delta);
        }
    }

    // 총 금액 계산 함수
    function updateTotalPrice(price) {
        let totalPriceSpan = document.querySelector('#totalPrice');
        let totalPrice = parseInt(totalPriceSpan.textContent.replace(/,/g, ''));
        totalPrice += price;

        totalPriceSpan.textContent = totalPrice.toLocaleString();
    }

    function orderMenu() {
        const cartItems = document.querySelectorAll('.cart-item');
        let orderDetails = "";
        let count = 0;

        cartItems.forEach(item => {
            const name = item.querySelector('label').innerText; 
            const quantity = item.querySelector('.quantity input').value; 
            const price = item.querySelector('.price').innerText; 
            
            if (parseInt(quantity) > 0) {
                count++;
                orderDetails += `<li>${name} (${quantity}개) - ${price}원</li>`;
            }
        });
        
        const totalPrice = document.querySelector('#totalPrice').innerText;

        const totalPriceH3 = document.querySelector('.popup-total-price');
        totalPriceH3.textContent = `${totalPrice}`;

        const orderList = document.querySelector('.order-list');
        orderList.innerHTML = orderDetails;

        if (count > 0) {
            document.getElementById('popupContainer').style.display = 'block';
        } else {
            alert('선택한 메뉴가 없습니다.');
        }
    }

    function orderYes() {
        alert('주문이 접수되었습니다.');
        location.reload();
    }

    function orderNo() {
        document.getElementById('popupContainer').style.display = 'none';
    }
    
    
    // 팝업 화면 닫기
    document.getElementById('closeBtn').addEventListener('click', function() {
        document.getElementById('popupContainer').style.display = 'none';
    });

    // 취소 함수
    function resetMenu() {
        alert('취소되었습니다.');
        location.reload();
    }
