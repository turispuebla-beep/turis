import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
    memberId: mongoose.Types.ObjectId;
    teamId: mongoose.Types.ObjectId;
    concept: string;
    amount: number;
    paymentMethod?: string;
    reference?: string;
    bizumPhone?: string;
    receipt?: string;
    status: 'pending' | 'completed' | 'cancelled';
    dueDate: Date;
    paidAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    markAsPaid: (method: string, reference?: string, bizumPhone?: string) => Promise<void>;
}

const PaymentSchema = new Schema<IPayment>({
    memberId: {
        type: Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    teamId: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    concept: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentMethod: {
        type: String,
        enum: ['bizum', 'cash', 'transfer', 'card'],
        default: null
    },
    reference: {
        type: String,
        default: null
    },
    bizumPhone: {
        type: String,
        default: null
    },
    receipt: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    dueDate: {
        type: Date,
        required: true
    },
    paidAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

PaymentSchema.methods.markAsPaid = async function(
    method: string,
    reference?: string,
    bizumPhone?: string
) {
    this.paymentMethod = method;
    this.reference = reference;
    this.bizumPhone = bizumPhone;
    this.status = 'completed';
    this.paidAt = new Date();
    await this.save();
};

export default mongoose.model<IPayment>('Payment', PaymentSchema);




