const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  

describe('SeleniumTest', () => {
    let driver = new Builder().forBrowser('chrome').build();

    it('1_5_creating_free_period_and_sending_request_for_free_period_as_patient', async () => {

        let result = true;
        try {

            await driver.manage().setTimeouts({implicit: 20000})
    
            await driver.get('http://127.0.0.1:3000/login');
    
            await driver.findElement(By.xpath("//*[@id='type']")).click();
            await driver.findElement(By.xpath("//*[@id='type']/div/button[.='Admin klinike']")).click();
            await driver.findElement(By.id('username')).sendKeys('clinic_admin');
            await driver.findElement(By.id('password')).sendKeys('clinic_admin');
            await driver.findElement(By.id('login-button')).click();
            await driver.wait(until.elementIsVisible(driver.findElement(By.id('clinic-appointments'))),20000);
    
            await driver.executeScript("document.getElementById('clinic-appointments').click();")
            //await driver.findElement(By.id("clinic-appointments")).click();
            await driver.wait(until.elementIsVisible(driver.findElement(By.id('create-appointment'))),20000);
            await driver.executeScript("document.getElementById('create-appointment').click();")
    
            //await driver.executeScript("document.getElementById('create-appointment').click();")
    
            await driver.findElement(By.id('date')).sendKeys('02/10/2020, 12:00 AM', Key.ENTER);
            await driver.findElement(By.id('duration')).sendKeys('60');
            await driver.findElement(By.id('price')).sendKeys('25');
            await driver.findElement(By.xpath("//*[@id='type']")).click();
            await driver.findElement(By.xpath("//*[@id='type']/div/button[1]")).click();
    
            await driver.findElement(By.xpath("//*[@id='ordination']")).click();
            await driver.findElement(By.xpath("//*[@id='ordination']/div/button[1]")).click();
    
            await driver.findElement(By.xpath("//*[@id='doctor']")).click();
            await driver.findElement(By.xpath("//*[@id='doctor']/div/button[1]")).click();
    
    
            //await driver.findElement(By.xpath("//*[@id='create-appointment-button']")).click();
            await driver.executeScript("document.getElementById('create-appointment-button').click();")
    
            await sleep(2000);
            await driver.wait(until.elementIsVisible(driver.findElement(By.id('logout'))),20000);
    
            await driver.executeScript("document.getElementById('logout').click();window.location.href='/login';")
    
            await driver.wait(until.elementIsVisible(driver.findElement(By.id('type'))),20000);
    
            await driver.findElement(By.xpath("//*[@id='type']")).click();
            await driver.findElement(By.xpath("//*[@id='type']/div/button[.='Pacijent']")).click();
            await driver.findElement(By.id('username')).sendKeys('pacijent');
            await driver.findElement(By.id('password')).sendKeys('pacijent');
            await driver.findElement(By.id('login-button')).click();
    
            await driver.wait(until.elementIsVisible(driver.findElement(By.id('patient-clinics'))),20000);
            await driver.executeScript("document.getElementById('patient-clinics').click();")
            await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//div[@class='table-row row']/div[.='Clinic']"))),20000).click();
            await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//div[.='Lista unaprijed kreiranih pregleda']"))),20000).click();
    
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("//div[.='10.02.2020, 00:00']/../div[@class='actions col-lg-2']/button[.='ZAKAZI']"))),3000).click();
    
        
        } catch(e){
            console.log(e);
            result = false;
        }

        expect(result).to.equal(true);
    });

    after(async () => driver.quit());
});