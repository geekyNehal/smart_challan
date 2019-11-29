'use strict';

/* global getAssetRegistry getFactory emit */

/**
 * transaction processor function for giving fine.
 * @param {org.example.basic.FineGiven} fineGiven The fine transaction instance.
 * @transaction
 */
async function pay(fineGiven) {  // eslint-disable-line no-unused-vars
	
  	const me = getCurrentParticipant();
  	console.log('Fine Given by: ' + me.getIdentifier() + ' of Amount: ' + fineGiven.amount + ' taken by ' + fineGiven.policeId);
  	
  	if(!me) {
        throw new Error('A participant/certificate mapping does not exist.');
    }
  
  	const event = getFactory().newEvent('org.example.basic', 'FineTransactionEvent');
    event.fineTransaction = fineGiven;
    emit(event);
  
  	const participantRegistry = await getParticipantRegistry('org.example.basic.Driver');
    await participantRegistry.update(me);
}

/**
 * transaction processor function for giving fine.
 * @param {org.example.basic.FineReceived} fineReceived The fine transaction instance.
 * @transaction
 */
async function received(fineReceived){
	const me = getCurrentParticipant();
  	console.log('Fine Received by: ' + me.getIdentifier() + ' of Amount: ' + fineReceived.amount + ' given by ' + fineReceived.driverId);
  	
  	if(!me) {
        throw new Error('A participant/certificate mapping does not exist.');
    }
  
  	const event = getFactory().newEvent('org.example.basic', 'FineTransactionEvent');
    event.fineTransaction = fineReceived;
    emit(event);
  
  	const participantRegistry = await getParticipantRegistry('org.example.basic.Police');
    await participantRegistry.update(me);
}
/* global getCurrentParticipant getParticipantRegistry getFactory emit */

/**
 * A Driver grants access to their record to Police.
 * @param {org.example.basic.AuthorizeAccess} authorize - the authorize to be processed
 * @transaction
 */
async function authorizeAccess(authorize) {  // eslint-disable-line no-unused-vars

    const me = getCurrentParticipant();
    console.log('**** AUTH: ' + me.getIdentifier() + ' granting access to ' + authorize.policeId );

    if(!me) {
        throw new Error('A participant/certificate mapping does not exist.');
    }

    // if the member is not already authorized, we authorize them
    let index = -1;

    if(!me.authorized) {
        me.authorized = [];
    }
    else {
        index = me.authorized.indexOf(authorize.policeId);
    }

    if(index < 0) {
        me.authorized.push(authorize.policeId);

        // emit an event
        const event = getFactory().newEvent('org.example.basic', 'AccessTransactionEvent');
        event.accessTransaction = authorize;
        emit(event);

        // persist the state of the participant
        const participantRegistry = await getParticipantRegistry('org.example.basic.Driver');
        await participantRegistry.update(me);
    }
}

/**
 * A Member revokes access to their record from another Member.
 * @param {org.example.basic.RevokeAccess} revoke - the RevokeAccess to be processed
 * @transaction
 */
async function revokeAccess(revoke) {  // eslint-disable-line no-unused-vars

    const me = getCurrentParticipant();
    console.log('**** REVOKE: ' + me.getIdentifier() + ' revoking access to ' + revoke.policeId );

    if(!me) {
        throw new Error('A participant/certificate mapping does not exist.');
    }

    // if the member is authorized, we remove them
    const index = me.authorized ? me.authorized.indexOf(revoke.policeId) : -1;

    if(index>-1) {
        me.authorized.splice(index, 1);

        // emit an event
        const event = getFactory().newEvent('org.example.basic', 'AccessTransactionEvent');
        event.driverTransaction = revoke;
        emit(event);

        // persist the state of the participant
      	const participantRegistry = await getParticipantRegistry('org.example.basic.Driver');
        await participantRegistry.update(me);
    }
}
