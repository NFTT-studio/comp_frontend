
class DataApi{
    static pageTokens=async (page)=>{
        let uri = "http://www.chineseoperamaskplus.com/assets/list/"+
            // let uri = "http://localhost:8080/assets/list/"+
            (page+1)+"/12";
        let res = await fetch(uri);
        return await res.json();
    }
    static fetchAddressTokens = async (address)=>{
        let uri = "http://www.chineseoperamaskplus.com/assets/address/"+address
        // let uri = "http://localhost:8080/assets/address/"+address
        let res = await fetch(uri);
        return await res.json();
    }
}
export default DataApi
