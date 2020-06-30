import firebase, {firestore} from "../db/Firebase";
import { Alert } from 'react-native';

export default async function registerUser(name, email, password) {    
    try {
        firebase.auth().signInWithEmailAndPassword(email, password).then(
        ).catch(error => {
            firebase.auth().createUserWithEmailAndPassword(email, password).then((cred) => {
                firestore.collection("users").doc(cred.user.uid).set({
                    name: name,
                    uid: cred.user.uid
                })
            })
            .catch(error =>{
                Alert.alert(error.message);
            })
        })
        
        
    }
    catch(error) {
        Alert.alert(error.message);
    } 

    
}